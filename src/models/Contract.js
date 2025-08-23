import { GeoPoint, serverTimestamp } from "firebase/firestore";
import { enforceTimestamp } from "../constants/data";

class Contract {
  // Private members
  #postedBy = "";
  #postedOn = null; // Firebase Timestamp
  #deletedOn = null; // Firebase Timestamp
  #startDate = null; // Firebase Timestamp
  #duration = "";
  #title = "";
  #description = "";
  #skills = [];
  #location = null; // Firebase GeoPoint
  #rate = null;
  #applicants = [];

  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      // Initialize from data or use defaults
      this.#postedBy = data.postedBy || this.#postedBy;
      this.#postedOn = (data.postedOn ? enforceTimestamp(data.postedOn) : this.#postedOn);
      this.#deletedOn = (data.deletedOn ? enforceTimestamp(data.deletedOn) : this.#deletedOn);
      this.#startDate = (data.startDate ? enforceTimestamp(data.startDate) : this.#startDate);
      this.#duration = data.duration || this.#duration;
      this.#title = data.title || this.#title;
      this.#description = data.description || this.#description;
      this.#skills = data.skills || this.#skills;
      this.#location = (data.location instanceof GeoPoint ? data.location : this.#location);
      this.#rate = data.rate || this.#rate;
      this.#applicants = data.applicants || this.#applicants;
    }
  }

  // Getters
  get postedBy() { return this.#postedBy; }
  get postedOn() { return this.#postedOn; }
  get deletedOn() { return this.#deletedOn; }
  get startDate() { return this.#startDate; }
  get duration() { return this.#duration; }
  get title() { return this.#title; }
  get description() { return this.#description; }
  get skills() { return this.#skills; }
  get location() { return this.#location; }
  get rate() { return this.#rate; }
  get applicants() { return this.#applicants; }

  // Setters with validation
  set postedBy(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }
    this.#postedBy = value;
  }

  set postedOn(value) {
    this.#postedOn = enforceTimestamp(value);
  }

  set deletedOn(value) {
    this.#deletedOn = enforceTimestamp(value);
  }

  set startDate(value) {
    this.#startDate = enforceTimestamp(value);
  }

  set duration(value) {
    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Value must be a non-empty string");
    }

    this.#duration = value.trim();
  }

  set title(value) {
    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Value must be a non-empty string");
    }

    this.#title = value.trim();
  }

  set description(value) {
    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Value must be a non-empty string");
    }

    this.#description = value.trim();
  }

  set skills(value) {
    if (!Array.isArray(value) || value.some((skill) => (typeof skill !== "string") || (skill.trim() === ""))) {
      throw new Error("Value must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#skills = [...new Set(value.map((skill) => skill.trim()))]; // Remove duplicates using Set
  }

  set location(value) {
    if (!(value instanceof GeoPoint)) {
      throw new Error("Value must be a GeoPoint object");
    }

    this.#location = value;
  }

  set rate(value) {
    if ((value !== null) && (typeof value !== "number")) {
      throw new Error("Rate must be a number or null");
    }

    this.#rate = value;
  }

  set applicants(value) {
    if (!Array.isArray(value) || value.some((applicant) => (typeof applicant !== "string") || (applicant.trim() === ""))) {
      throw new Error("Value must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#applicants = [...new Set(value.map((applicant) => applicant.trim()))]; // Remove duplicates using Set
  }

  // Methods
  isActive() {
    return (this.#deletedOn === null);
  }

  delete() {
    this.#deletedOn = serverTimestamp();
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    return {
      postedBy:  this.#postedBy,
      postedOn:  this.#postedOn,
      deletedOn:  this.#deletedOn,
      startDate:  this.#startDate,
      duration:  this.#duration,
      title:  this.#title,
      description:  this.#description,
      skills:  this.#skills,
      location:  this.#location,
      rate:  this.#rate,
      applicants:  this.#applicants
    };
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    const data = doc?.data();

    return data ? new Contract(data) : null;
  }
}

export default Contract;