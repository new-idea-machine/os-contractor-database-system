import { enforceSchema } from "../constants/data";
import { Project } from "./Project";

const userSchema = {
  availability: this.AVAILABILITY_NOT_AVAILABLE,
  deletedOn: null, // Timestamp
  email: "",
  favourites: [""],
  firstNames: "",
  gitHubURL: "",
  isAdmin: false,
  isContractor: false,
  isRecruiter: false,
  lastLoggedOut: null, // Timestamp
  lastName: "",
  linkedInURL: "",
  location_geohash: "",
  location_latitude: 0,
  location_longitude: 0,
  profileImageURL: "",
  profileAbout: "",
  projects: [], // Array of Project objects
  skills: [""],
  specialization: "",
  videoURL: "",
  worksite_hybrid: false,
  worksite_onSite: false,
  worksite_remote: false
};

class User {
  static AVAILABILITY_NOT_AVAILABLE = 0;
  static AVAILABILITY_PART_TIME = 1;
  static AVAILABILITY_FULL_TIME = 2;
  static AVAILABILITY_STRINGS = ["Not Available", "Part Time", "Full Time"];
  static WORKSITE_STRINGS = { onSite: "On-Site", remote: "Remote", hybrid: "Hybrid" };

  constructor(data) {
    // Apply schema validation
    enforceSchema(data, userSchema);
    Object.assign(this, data);

    // Initialize arrays if they don't exist
    this.favourites = this.favourites || [];
    this.projects = this.projects || [];
    this.skills = this.skills || [];

    // Set default values for boolean fields
    this.isAdmin = !!this.isAdmin;
    this.isContractor = !!this.isContractor;
    this.isRecruiter = !!this.isRecruiter;
    this.worksite_hybrid = !!this.worksite_hybrid;
    this.worksite_onSite = !!this.worksite_onSite;
    this.worksite_remote = !!this.worksite_remote;

    this.projects.forEach((project) => project = new Project(project));
  }

  // Getters
  get isActive() {
    return this.deletedOn === null;
  }

  get worksitePreferences() {
    const preferences = [];

    if (this.worksite_onSite) preferences.push(this.WORKSITE_STRINGS.onSite);
    if (this.worksite_remote) preferences.push(this.WORKSITE_STRINGS.remote);
    if (this.worksite_hybrid) preferences.push(this.WORKSITE_STRINGS.hybrid);

    return preferences;
  }

  get availabilityToString() {
    return User.AVAILABILITY_STRINGS[this.availability];
  }

  // Methods
  fullName(lastNameFirst = false) {
    if (lastNameFirst) return `${this.lastName}, ${this.firstNames}`.trim();
    return `${this.firstNames} ${this.lastName}`.trim();
  }

  addProject(project) {
    this.projects.push(project);
  }

  removeProject(projectTitle) {
    this.projects = this.projects.filter((project) => project.title !== projectTitle);
  }

  addSkill(skill) {
    if (!this.skills.includes(skill)) {
      this.skills.push(skill);
    }
  }

  removeSkill(skill) {
    this.skills = this.skills.filter((element) => element !== skill);
  }

  addFavourite(id) {
    if (!this.favourites.includes(id)) {
      this.favourites.push(id);
    }
  }

  removeFavourite(id) {
    this.favourites = this.favourites.filter((element) => element !== id);
  }

  isFavourite(id) {
    return this.favourites.includes(id);
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    // Create a copy of the object without methods
    const document = { ...this };

    // Remove any undefined values
    Object.keys(document).forEach(key => {
      if (document[key] === undefined) {
        delete document[key];
      }
    });

    return document;
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;
    return new User(doc.data());
  }
}

export default User;