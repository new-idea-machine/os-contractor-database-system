import { enforceSchema } from "../constants/data";

const schema = {
  postedBy: "",
  postedOn: null, // timestamp
  deletedOn: null, // timestamp
  startDate: null, // timestamp
  duration: ""
};

class Contract {
  constructor(data) {
    // Apply schema validation
    enforceSchema(data, schema);
    Object.assign(this, data);
  }

  // Validate contract data
  validate() {
    if (!this.postedBy) {
      throw new Error("Poster ID is required");
    }

    if (!this.startDate) {
      throw new Error("Start date is required");
    }

    if (!this.duration || this.duration.trim() === "") {
      throw new Error("Duration is required");
    }

    if (!this.postedOn) {
      this.postedOn = new Date();
    }

    return true;
  }

  // Check if contract is active
  get isActive() {
    return this.deletedOn === null;
  }

  // Delete contract
  delete() {
    this.deletedOn = new Date();
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
  }
}

export default Contract;