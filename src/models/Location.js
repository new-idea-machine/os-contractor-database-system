/**
 * Location model for storing geographical coordinates and geohash
 * Used to determine a user's proximity to an on-site work location
 */
class Location {
  // Private fields
  #geohash = "";
  #latitude = 0.0;
  #longitude = 0.0;

  /**
   * Create a new Location instance
   * @param {Object} data - Location data
   * @param {string} data.geohash - Geohash string for efficient geospatial queries
   * @param {number} data.latitude - Latitude coordinate
   * @param {number} data.longitude - Longitude coordinate
   */
  constructor(data = {}) {
    // Initialize from data or use defaults
    this.#geohash = data.geohash || this.#geohash;
    this.#latitude = typeof data.latitude === 'number' ? data.latitude : this.#latitude;
    this.#longitude = typeof data.longitude === 'number' ? data.longitude : this.#longitude;
  }

  // Getters
  get geohash() { return this.#geohash; }
  get latitude() { return this.#latitude; }
  get longitude() { return this.#longitude; }

  // Setters with validation
  set geohash(value) {
    if (typeof value !== "string") {
      throw new Error("Geohash must be a string");
    }
    this.#geohash = value;
  }

  set latitude(value) {
    if (typeof value !== "number") {
      throw new Error("Latitude must be a number");
    }
    if (value < -90.0 || value > 90.0) {
      throw new Error("Latitude must be between -90 and 90 degrees");
    }
    this.#latitude = value;
  }

  set longitude(value) {
    if (typeof value !== "number") {
      throw new Error("Longitude must be a number");
    }
    if (value < -180.0 || value > 180.0) {
      throw new Error("Longitude must be between -180 and 180 degrees");
    }
    this.#longitude = value;
  }

  /**
   * Calculate distance between this location and another location in kilometers
   * Uses the Haversine formula
   * @param {Location} otherLocation - The other location to calculate distance to
   * @returns {number} Distance (in kilometers)
   */
  distanceTo(otherLocation) {
    if (!(otherLocation instanceof Location)) {
      throw new Error("Parameter must be a Location instance");
    }

    const earthRadius = 6371; // Earth's average radius (in kilometers)
    const dLatitude = this.#toRadians(otherLocation.latitude - this.#latitude);
    const dLongitude = this.#toRadians(otherLocation.longitude - this.#longitude);

    const halfChordSquared =
      Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
      Math.cos(this.#toRadians(this.#latitude)) * Math.cos(this.#toRadians(otherLocation.latitude)) *
      Math.sin(dLongitude / 2) * Math.sin(dLongitude / 2);

    const angle = 2 * Math.atan2(Math.sqrt(halfChordSquared), Math.sqrt(1 - halfChordSquared));

    return earthRadius * angle;
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   * @private
   */
  #toRadians(degrees) {
    return degrees * (Math.PI / 180.0);
  }

  /**
   * Check if the location has valid coordinates
   * @returns {boolean} True if location has valid coordinates
   */
  isValid() {
    return (
      typeof this.#latitude === 'number' &&
      !isNaN(this.#latitude) &&
      typeof this.#longitude === 'number' &&
      !isNaN(this.#longitude)
    );
  }

  /**
   * Convert to a plain object for Firebase storage
   * @returns {Object} Plain object representation
   */
  toFirebaseDocument() {
    return {
      geohash: this.#geohash,
      latitude: this.#latitude,
      longitude: this.#longitude
    };
  }

  /**
   * Create a string representation of the location
   * @returns {string} String representation
   */
  toString() {
    return `${this.#latitude.toFixed(6)}, ${this.#longitude.toFixed(6)}`;
  }
}

export default Location;