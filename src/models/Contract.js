import { Timestamp, serverTimestamp } from "firebase/firestore";
import { isValidTimestamp } from "../constants/data";

class Contract {
  // Class members
  #postedBy = "";
  #postedOn = null; // Firebase Timestamp
  #deletedOn = null; // Firebase Timestamp
  #startDate = null;
  #duration = "";
  #title = "";
  #description = "";
  #skills = [];
  #location = "";
  #rate = null;
  #applicants = [];

  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      // Initialize from data or use defaults
      this.#postedBy = data.postedBy || this.#postedBy;
      this.#postedOn = data.postedOn || this.#postedOn;
      this.#deletedOn = data.deletedOn || this.#deletedOn;
      this.#startDate = data.startDate || this.#startDate;
      this.#duration = data.duration || this.#duration;
      this.#title = data.title || this.#title;
      this.#description = data.description || this.#description;
      this.#skills = data.skills || this.#skills;
      this.#location = data.location || this.#location;
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
  get skills() { return [...this.#skills]; } // Return a copy to prevent direct modification
  get location() { return this.#location; }
  get rate() { return this.#rate; }
  get applicants() { return [...this.#applicants]; } // Return a copy to prevent direct modification

  // Computed properties
  get isActive() {
    return this.#deletedOn === null;
  }

  // Setters with validation
  set postedBy(value) {
    if (typeof value !== "string") {
      throw new Error("Posted by must be a string");
    }
    this.#postedBy = value;
  }

  set postedOn(value) {
    if (value !== null && !isValidTimestamp(value)) {
      throw new Error("Posted on must be a Date, null, or a valid timestamp");
    }
    this.#postedOn = (value instanceof Date ? Timestamp.fromDate(value) : value);
  }

  set deletedOn(value) {
    if (value !== null && !isValidTimestamp(value)) {
      throw new Error("Deleted on must be a Date, null, or a valid timestamp");
    }
    this.#deletedOn = (value instanceof Date ? Timestamp.fromDate(value) : value);
  }

  set startDate(value) {
    if (value !== null && !isValidTimestamp(value)) {
      throw new Error("Start date must be a Date, null, or a valid timestamp");
    }
    this.#startDate = (value instanceof Date ? Timestamp.fromDate(value) : value);
  }

  set duration(value) {
    if (typeof value !== "string") {
      throw new Error("Duration must be a string");
    }
    this.#duration = value;
  }

  set title(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("Title must be a non-empty string");
    }
    this.#title = value;
  }

  set description(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("Description must be a non-empty string");
    }
    this.#description = value;
  }

  set skills(value) {
    if (!Array.isArray(value) || value.some((skill) => typeof skill !== "string" || skill.trim() === "")) {
      throw new Error("Skills must be an array of non-empty strings (no duplicates)");
    }
    this.#skills = [...value];
  }

  set location(value) {
    if (typeof value !== "string") {
      throw new Error("Location must be a string");
    }
    this.#location = value;
  }

  set rate(value) {
    if (value !== null && typeof value !== "number") {
      throw new Error("Rate must be a number or null");
    }
    this.#rate = value;
  }

  set applicants(value) {
    if (!Array.isArray(value) || value.some((skill) => typeof skill !== "string" || skill.trim() === "")) {
      throw new Error("Applicants must be an array of non-empty strings (no duplicates)");
    }
    this.#applicants = [...value];
  }

  // Methods
  validate() {
    if (!this.#postedBy) {
      throw new Error("Poster ID is required");
    }

    if (!this.#startDate) {
      throw new Error("Start date is required");
    }

    if (!this.#duration || this.#duration.trim() === "") {
      throw new Error("Duration is required");
    }

    if (!this.#title || this.#title.trim() === "") {
      throw new Error("Title is required");
    }

    if (!this.#description || this.#description.trim() === "") {
      throw new Error("Description is required");
    }

    return true;
  }

  delete() {
    this.#deletedOn = serverTimestamp();
  }

  addSkill(skill) {
    if (typeof skill !== "string" || skill.trim() === "") {
      throw new Error("Skill must be a non-empty string");
    }
    if (!this.#skills.includes(skill)) {
      this.#skills.push(skill);
    }
  }

  removeSkill(skill) {
    this.#skills = this.#skills.filter(s => s !== skill);
  }

  addApplicant(applicantId) {
    if (typeof applicantId !== "string" || applicantId.trim() === "") {
      throw new Error("Applicant ID must be a non-empty string");
    }
    if (!this.#applicants.includes(applicantId)) {
      this.#applicants.push(applicantId);
    }
  }

  removeApplicant(applicantId) {
    this.#applicants = this.#applicants.filter(id => id !== applicantId);
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    return {
      postedBy: this.#postedBy,
      postedOn: this.#postedOn,
      deletedOn: this.#deletedOn,
      startDate: this.#startDate,
      duration: this.#duration,
      title: this.#title,
      description: this.#description,
      skills: this.#skills,
      location: this.#location,
      rate: this.#rate,
      applicants: this.#applicants
    };
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;

    return new Contract(doc.data());
  }
}

export default Contract;