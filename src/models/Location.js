/**
 * @fileoverview Location data model for managing geographical coordinates and geohashes.
 *
 * This module implements the Location class, providing functionality for storing and
 * manipulating geographical co-ordinates in Firebase documents.  Co-ordinates are stored in
 * GeoPoint instances, and geohash strings are automatically updated when the co-ordinates are
 * changed.  There's a method for calculating the ground distance to another Location instance.
 *
 * The geohash encoding system is used for efficient geospatial queries in Firebase, allowing
 * for proximity-based searches and location filtering.  The Location class maintains both
 * co-ordinate and geohash representations to optimize database operations while providing
 * convenient access to geographical data.
 *
 * Key features:
 * - Automatic geohash generation and synchronization with geographical co-ordinates
 * - Robust error handling with fallback to default coordinates (0°, 0°)
 * - Can calculate the surface distance to another Location instance
 * - Firebase-compatible document serialization
 *
 * @see {@link https://firebase.google.com/docs/firestore/solutions/geoqueries} [Geo queries]
 * for information on how to query a Firebase collection using geohashes.
 *
 * @example
 * import { doc, getDoc, updateDoc, setDoc, GeoPoint } from "firebase/firestore";
 * import { db } from "../firebase";
 * import Location from "../models/Location";
 *
 * // Fetch a document from Firebase using automatic converter
 *
 * const locationRef = doc(db, "locations", locationId).withConverter(Location.firebaseConverter);
 * const locationSnapshot = await getDoc(locationRef);
 * const location = locationSnapshot.data();  // Already a Location instance
 *
 * // Access location data
 *
 * console.log(`Latitude: ${location.latitude}`);
 * console.log(`Longitude: ${location.longitude}`);
 * console.log(`Geohash: ${location.geohash}`);
 *
 * // Update coordinates and save back to Firebase (automatic conversion to plain object)
 *
 * location.setCoordinates(51.05, -114.07);  // co-ordinates for Calgary, AB, Canada
 * await setDoc(locationRef, location);
 *
 * // Or update specific fields without converter
 *
 * const newLocationData = location.toFirebaseDocument();
 * newLocationData.geohash = geohashForLocation(newLocationData.coordinates.latitude,
 *   newLocationData.coordinates.longitude);
 * await updateDoc(doc(db, "locations", locationId), newLocationData);
 *
 * // Calculate distance between two locations
 *
 * const remoteLocation = new Location({
 *   coordinates: new GeoPoint(45.4247, -75.6950)  // co-ordinates for Ottawa, ON, Canada
 * });
 * const distance = location.distanceTo(remoteLocation);
 * console.log(`Distance to remote location:  ${distance.toFixed(2)} km`);
 *
 * @module models/Location
 * @requires firebase/firestore
 * @requires firebase/geofire
 */

import { GeoPoint } from "firebase/firestore";
import { distanceBetween, geohashForLocation } from "firebase/geofire";

/**
 * Convert a geohash string to a GeoPoint instance.
 *
 * @param {string} geohash - The geohash string to convert.
 * @returns {Object} The resultant GeoPoint instance.
 * @throws {Error} The geohash isn't valid.
 */
function locationForGeohash(geohash) {
  /*
  Geohash encoding works by repeatedly taking the range of possible values for a latitude &
  longitude, then finding the midpoint between those two extremes.  If the actual coordinates
  are in the lower half of the range then a 0 bit is appended to the hash, otherwise a 1 bit is
  appended.  The midpoint then becomes part of the range for the next iteration.  The more bits
  there are, the more precise the geohash is to the actual location.  Bits for longitude &
  latitude are interleaved (starting with longitude).

  Each group of five bits is represented by a character (see the "geohashAlphabet" constant for
  the characters used) in the geohash string.  "Precision" refers to the number of characters
  in the geohash, not the number of bits.
  */

  const geohashAlphabet = "0123456789bcdefghjkmnpqrstuvwxyz";
  const rangeLowerIndex = 0;
  const rangeUpperIndex = 1;

  let bitPositionIsEven = true;
  let latitudeRange = [-90.0, 90.0];
  let longitudeRange = [-180.0, 180.0];

  function refineRange(range, index) {
    console.assert(Array.isArray(range));
    console.assert(range.length === 2);
    console.assert((index >= 0) || (index < range.length));

    const midPoint = (range[0] + range[1]) / 2.0;

    range[index] = midPoint;
  }

  /*
  These are the main loops.  During each iteration, each character in the geohash is extracted
  in order and its corresponding 32-bit value is determined from the geohash alphabet.  Next,
  each bit in that value is used to narrow down the range of either the latitude or the
  longitude (alternating, starting with longitude).
  */

  for (const char of geohash) {
    const charValue = geohashAlphabet.indexOf(char.toLowerCase());

    if (charValue === -1) {
      throw new Error(`Invalid character in geohash:  ${char}`);
    }

    for (let bitMask = 16; bitMask >= 1; bitMask >>= 1) {
      const index = charValue & bitMask ? rangeLowerIndex : rangeUpperIndex;

      refineRange((bitPositionIsEven ? longitudeRange : latitudeRange), index);
      bitPositionIsEven = !bitPositionIsEven;
    }
  }

  /*
  At this point, the ranges of both latitude & longitude give us a geographic box.  The
  centre of this box is used to create the returned GeoPoint instance.
  */

  console.assert(latitudeRange.length === 2);
  console.assert(longitudeRange.length === 2);

  return new GeoPoint((latitudeRange[0] + latitudeRange[1]) / 2.0,
    (longitudeRange[0] + longitudeRange[1]) / 2.0);
}

/**
 * Location model for storing geographical coordinates and geohash.
 *
 * Used to determine a user's proximity to an on-site work location.
 */
class Location {
  // Private members

  /**
   * The instance's geographic co-ordinates (must be kept synchronized with geohash member).
   * @private
   * @type {Object}
   */
  #coordinates;  // See constructor for default initial value

  /**
   * The geohash of the instance's geographic co-ordinates (must be kept synchronized with
   * coordinates member).
   * @private
   * @type {Object}
   */
  #geohash = "s000000000";

  // Constructor

  /**
   * Create a new Location instance.  If no co-ordinates can be discerned from the arguments
   * then 0° latitude, 0° longitude is used as the default co-ordinates.
   *
   * @param {Object} data - Location data
   * @param {Object} data.coordinates - GeoPoint data containing latitude and longitude
   * @param {string} data.geohash - Geohash string for efficient geospatial queries
   */
  constructor(data = {}) {
    const defaultCoordinates = [0.0, 0.0];
    const coordinatesAreGeoPoint = data.coordinates instanceof GeoPoint;
    const geohashIsString = typeof data.geohash === "string";

    /*
    This constructor considers the possibility that data may be missing and does its best to
    maintain data integrity.

    If one of "data.coordinates" or "data.geohash" is invalid then it's derived from the other.
    If both are invalid then default co-ordinates are used.

    If both members of "data" are valid then it's assumed that the two are consistent and, for
    the sake of efficiency, no consistency checking is performed.
    */

    if (coordinatesAreGeoPoint) {
      this.#coordinates = data.coordinates;
      this.#geohash = geohashIsString ? data.geohash : geohashForLocation(this.#coordinates);
    }
    else if (geohashIsString) {
      try {
        this.#coordinates = locationForGeohash(data.geohash);
        this.#geohash = data.geohash;
      }
      catch {
        this.#coordinates = new GeoPoint(...defaultCoordinates);
      }
    }
    else {
      this.#coordinates = new GeoPoint(...defaultCoordinates);
    }
  }

  // Getters

  /**
   * Get the geohash string for this location.
   *
   * @returns {string} The geohash string representing this location
   */
  get geohash() { return this.#geohash; }

  /**
   * Get the latitude coordinate of this location.
   *
   * @returns {number} The latitude in degrees (between -90 and 90)
   */
  get latitude() { return this.#coordinates.latitude; }

  /**
   * Get the longitude coordinate of this location.
   *
   * @returns {number} The longitude in degrees (between -180 and 180)
   */
  get longitude() { return this.#coordinates.longitude; }

  // Methods

  /**
   * Set the geographical coordinates for this location and update the geohash.
   *
   * @param {number} latitude - The latitude coordinate in degrees (must be between -90 and 90)
   * @param {number} longitude - The longitude coordinate in degrees (must be between -180 and 180)
   * @throws {Error} When latitude or longitude are not numbers or are out of range
   */
  setCoordinates(latitude, longitude) {
    if ((typeof latitude !== "number") || (typeof longitude !== "number")) {
      throw new Error("Latitude and longitude must both be a numbers");
    }

    if (latitude < -90.0 || latitude > 90.0) {
      throw new Error("Latitude must be between -90 and 90 degrees");
    }

    if (longitude < -180.0 || longitude > 180.0) {
      throw new Error("Longitude must be between -180 and 180 degrees");
    }

    this.#coordinates = new GeoPoint(latitude, longitude);
    this.#geohash = geohashForLocation(latitude, longitude);
  }

  /**
   * Calculate the surface distance between this location and another location in kilometers.
   *
   * @param {Location} location - The location to calculate the distance to
   * @returns {number} Distance (in kilometers)
   */

  distanceTo(location) {
    if (!(location instanceof Location)) {
      throw new Error("\"location\" must be an instance of Location");
    }

    return distanceBetween([this.latitude, this.longitude], [location.latitude, location.longitude]);
  }

  /**
   * Convert to a plain JavaScript object for Firebase storage.
   *
   * This method serializes all project data into a format that can be directly
   * written to Firebase or embedded in other documents.
   *
   * @returns {Object} Plain JavaScript object representation of this instance
   */
  toFirebaseDocument() {
    return {
      coordinates:  this.#coordinates,
      geohash:  this.#geohash
    };
  }

  /**
   * Firestore converter for automatic serialization and deserialization of Location instances.
   *
   * Use this converter with Firestore document references to automatically convert between
   * Location instances and Firestore documents.  This is the recommended approach for
   * Firestore operations.
   *
   * @static
   * @type {Object}
   * @property {Function} fromFirestore - Converts Firestore document to Location instance
   * @property {Function} toFirestore - Converts Location instance to Firestore document
   * @example
   * const locationRef = doc(db, "locations", locationId).withConverter(Location.firebaseConverter);
   *
   * // Reading returns a Location instance
   *
   * const locationSnap = await getDoc(locationRef);
   * const user = locationSnap.data();  // Returns Location instance
   *
   * // Writing accepts a Location instance
   *
   * const newLocation = new Location({ geohash: "c3nfkm2gb3" });  // Calgary, AB, Canada
   * await setDoc(locationRef, newLocation);
   */
  static firebaseConverter = {
    fromFirestore:  (snapshot, options) => new Location(snapshot.data(options)),
    toFirestore:  (location) => location.toFirebaseDocument()
  };
}

export default Location;
