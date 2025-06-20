import { isValidTimestamp } from "../constants/data";

class UserViewed {
  // Private fields
  #timestamp = null;
  #viewedUser = "";
  #viewingUser = "";

  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      // Initialize from data or use defaults
      this.#timestamp = data.timestamp || this.#timestamp;
      this.#viewedUser = data.viewedUser || this.#viewedUser;
      this.#viewingUser = data.viewingUser || this.#viewingUser;

      // Set default timestamp if not provided
      if (!this.#timestamp) {
        this.#timestamp = new Date();
      }
    }
  }

  // Getters
  get timestamp() { return this.#timestamp; }
  get viewedUser() { return this.#viewedUser; }
  get viewingUser() { return this.#viewingUser; }

  // Setters with validation
  set timestamp(value) {
    if (value !== null && !isValidTimestamp(value)) {
      throw new Error("Timestamp must be null, a valid Date object or a valid timestamp");
    }
    this.#timestamp = value;
  }

  set viewedUser(value) {
    if (typeof value !== "string") {
      throw new Error("Viewed user ID must be a string");
    }
    this.#viewedUser = value;
  }

  set viewingUser(value) {
    if (typeof value !== "string") {
      throw new Error("Viewing user ID must be a string");
    }
    this.#viewingUser = value;
  }

  // Validate viewing data
  validate() {
    if (!this.#viewedUser) {
      throw new Error("Viewed user ID is required");
    }

    if (!this.#viewingUser) {
      throw new Error("Viewing user ID is required");
    }

    if (!this.#timestamp) {
      this.#timestamp = new Date();
    }

    return true;
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    return {
      timestamp: this.#timestamp,
      viewedUser: this.#viewedUser,
      viewingUser: this.#viewingUser
    };
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;

    return new UserViewed(doc.data());
  }
}

export default UserViewed;