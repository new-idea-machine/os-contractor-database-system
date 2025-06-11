import { enforceSchema } from "../constants/data";

const userViewedSchema = {
  timestamp: null, // Timestamp when the viewing occurred
  viewedUser: "", // The user ID of the user who was viewed
  viewingUser: "" // The user ID of the user who viewed the other user
};

class UserViewed {
  constructor(data) {
    // Apply schema validation
    enforceSchema(data, userViewedSchema);
    Object.assign(this, data);
  }

  // Validate viewing data
  validate() {
    if (!this.viewedUser) {
      throw new Error("Viewed user ID is required");
    }

    if (!this.viewingUser) {
      throw new Error("Viewing user ID is required");
    }

    if (!this.timestamp) {
      this.timestamp = new Date();
    }

    return true;
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    // Create a copy of the object without methods
    const document = { ...this };

    // Remove any undefined values and the id field (as it"s the document ID)
    Object.keys(document).forEach(key => {
      if (document[key] === undefined || key === "id") {
        delete document[key];
      }
    });

    return document;
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;
    return new UserViewed({
      ...doc.data(),
      id: doc.id
    });
  }
}

export default UserViewed;