import { GeoPoint } from "firebase/firestore";

/**
 * Convert degrees to radians.
 *
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 * @private
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180.0);
}

/**
 * Calculate the surface distance between two GeoPoint instances.
 *
 * @param {GeoPoint} location1 - The first location
 * @param {GeoPoint} location2 - The second location
 * @returns {number} Distance (in kilometers)
 */
function distanceBetween(location1, location2) {
  if (!((location1 instanceof GeoPoint) && (location2 instanceof GeoPoint))) {
    throw new Error("Both locations must be instances of GeoPoint");
  }

  /*
  This function uses the haversine formula, which may have an error of up to 0.5% compared to a
  complex ellipsoid calculation but is close enough for this project's purposes.  Since
  searching by distance between two points aims to be as inclusive as possible, the returned
  distance has an error adjustment applied to it to lower it slightly.

  See https://en.wikipedia.org/wiki/Haversine_formula for a description of this formula and
  https://www.movable-type.co.uk/scripts/latlong.html for a JavaScript implementation.
  */

  const errorCorrectionFactor = 1.0 / 1.005;
  const earthRadius = 6371; // Earth's average radius (in kilometers)

  const dLatitude = toRadians(location1.latitude - location2.latitude);
  const dLongitude = toRadians(location1.longitude - location2.longitude);

  const halfChordSquared =
    Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
    Math.cos(toRadians(location2.latitude)) * Math.cos(toRadians(location1.latitude)) *
    Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2);

  const angle = 2 * Math.atan2(Math.sqrt(halfChordSquared), Math.sqrt(1 - halfChordSquared));

  return earthRadius * angle * errorCorrectionFactor;
}

export { distanceBetween };