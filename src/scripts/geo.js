import { query, orderBy, startAt, endAt, getDocs, GeoPoint } from "firebase/firestore";
import { distanceBetween, geohashQueryBounds } from "firebase/geofire";

/**
 * Retrieves Firebase documents within a specified distance from a given location.
 *
 * This function performs geospatial queries using geohash-based bounds to efficiently
 * find documents within a circular radius.  It uses the Firebase GeoFire library to
 * generate query bounds and then filters results by actual distance calculation.
 *
 * @param {CollectionReference} collection - The Firebase collection to query
 * @param {GeoPoint} location - The center point for the distance search
 * @param {number} distance - The search radius in kilometers (must be greater than 0)
 *
 * @returns {Promise<DocumentSnapshot[]>} A promise that resolves to an array of Firebase
 *   DocumentSnapshot objects that are within the specified distance from the location
 *
 * @throws {Error} When location is not a GeoPoint instance
 * @throws {Error} When distance is less than or equal to zero
 *
 * @example
 * // Search for users within 10km of a specific location
 * import { collection, GeoPoint } from "firebase/firestore";
 * import { db } from "../firebaseconfig";
 * import { getFirebaseDocsWithinDistance } from "./geo";
 *
 * const municipalitiesCollection = collection(db, "municipalities");
 * const centerLocation = new GeoPoint(51.05, -114.066667); // Calgary, Alberta
 * const searchRadius = 50; // 50km
 *
 * try {
 *   const nearbyMunicipalities = await getFirebaseDocsWithinDistance(
 *     municipalitiesCollection,
 *     centerLocation,
 *     searchRadius
 *   );
 *   console.log(`Found ${nearbyMunicipalities.length} users within ${searchRadius}km`);
 * } catch (error) {
 *   console.error("Error searching for nearby municipalities:", error);
 * }
 *
 * @note
 * In order to operate correctly, this function requires documents in the collection to have
 * both a GeoPoint-type "location" field and a corresponding string-type "geohash" field.
 * Documents that lack either of these fields will not be returned, and if the two fields are
 * out-of-sync then documents may be omitted or incorrectly returned.
 *
 * @see {@link https://firebase.google.com/docs/firestore/solutions/geoqueries} Firebase Geoqueries
 * @see {@link https://github.com/firebase/geofire-js} GeoFire JavaScript Library
 */
async function getFirebaseDocsWithinDistance(collection, location, distance) {
  if (!(location instanceof GeoPoint)) {
    throw new Error("Location must be an instance of GeoPoint");
  }

  if (distance <= 0.0) {
    throw new Error("Distance must be greater than zero");
  }

  const centre = [location.latitude, location.longitude];

  /*
  First, the geohash bounds are determined ("geohashQueryBounds()" expects distances in metres,
  for some reason).  Next, a query for each set of bounds is simultaneously made.
  */

  const bounds = geohashQueryBounds(centre, distance * 1000.0);
  const promises = [];

  for (const bound of bounds) {
    const queryOnBound = query(
      collection,
      orderBy("geohash"),
      startAt(bound[0]),
      endAt(bound[1]));

    promises.push(getDocs(queryOnBound));
  }

  const snapshots = await Promise.all(promises);

  /*
  Last, since there may be false positives among the documents retrieved, each document is
  checked to see if it's in range and the ones that aren't are filtered out.
  */

  const matchingDocs = [];

  for (const snapshot of snapshots) {
    for (const doc of snapshot.docs) {
      const docLocation = doc?.data().location;

      if (docLocation) {
        const docDistance = distanceBetween(centre, [docLocation.latitude, docLocation.longitude]);

        if (docDistance <= distance) {
          matchingDocs.push(doc);
        }
      }
    }
  }

  return matchingDocs;
}

// /**
//  * Convert degrees to radians.
//  *
//  * @param {number} degrees - Angle in degrees
//  * @returns {number} Angle in radians
//  * @private
//  */
// function toRadians(degrees) {
//   return degrees * (Math.PI / 180.0);
// }

// /**
//  * Calculate the surface distance between two GeoPoint instances.
//  *
//  * @param {GeoPoint} location1 - The first location
//  * @param {GeoPoint} location2 - The second location
//  * @returns {number} Distance (in kilometers)
//  */
// function distanceBetween(location1, location2) {
//   if (!((location1 instanceof GeoPoint) && (location2 instanceof GeoPoint))) {
//     throw new Error("Both locations must be instances of GeoPoint");
//   }
//
//   /*
//   This function uses the haversine formula, which may have an error of up to 0.5% compared to a
//   complex ellipsoid calculation but is close enough for this project's purposes.  Since
//   searching by distance between two points aims to be as inclusive as possible, the returned
//   distance has an error adjustment applied to it to lower it slightly.
//
//   See https://en.wikipedia.org/wiki/Haversine_formula for a description of this formula and
//   https://www.movable-type.co.uk/scripts/latlong.html for a JavaScript implementation.
//   */
//
//   const errorCorrectionFactor = 1.0 / 1.005;
//   const earthRadius = 6371; // Earth's average radius (in kilometers)
//
//   const dLatitude = toRadians(location1.latitude - location2.latitude);
//   const dLongitude = toRadians(location1.longitude - location2.longitude);
//
//   const halfChordSquared =
//     Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
//     Math.cos(toRadians(location2.latitude)) * Math.cos(toRadians(location1.latitude)) *
//     Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2);
//
//   const angle = 2 * Math.atan2(Math.sqrt(halfChordSquared), Math.sqrt(1 - halfChordSquared));
//
//   return earthRadius * angle * errorCorrectionFactor;
// }

export { getFirebaseDocsWithinDistance };