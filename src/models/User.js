import { GeoPoint } from "firebase/firestore";
import { geohashForLocation } from "firebase/geofire";
import { enforceTimestamp } from "../constants/data";
import { Project } from "./Project";

class User {
  static AVAILABILITY_NOT_AVAILABLE = 0;
  static AVAILABILITY_PART_TIME = 1;
  static AVAILABILITY_FULL_TIME = 2;
  static AVAILABILITY_TEXTS = ["Not Available", "Part Time", "Full Time"];
  static WORKSITE_TEXTS = { onSite: "On-Site", remote: "Remote", hybrid: "Hybrid" };

  // Private members
  #availability; // See constructor for default value
  #deletedOn = null; // Firebase Timestamp
  #email = "";
  #favourites = [];
  #firstNames = "";
  #geohash = "";
  #gitHubURL = "";
  #isAdmin = false;
  #isContractor = false;
  #isRecruiter = false;
  #lastLoggedOut = null; // Firebase Timestamp
  #lastName = "";
  #linkedInURL = "";
  #location = null; // Firebase GeoPoint
  #profileImageURL = "";
  #profileAbout = "";
  #projects = [];
  #skills = [];
  #specialization = "";
  #videoURL = "";
  #worksite_hybrid = false;
  #worksite_onSite = false;
  #worksite_remote = false;

  constructor(data = {}) {
    const defaultAvailability = User.AVAILABILITY_NOT_AVAILABLE;

    if (data && typeof data === "object" && !Array.isArray(data)) {
      // Initialize from data or use defaults
      this.#availability = data.availability !== undefined ? data.availability : defaultAvailability;
      this.#deletedOn = (data.deletedOn ? enforceTimestamp(data.deletedOn) : this.#deletedOn);
      this.#email = data.email || this.#email;

      // Process favourites array
      if (Array.isArray(data.favourites)) {
        data.favourites.forEach(favourite => {
          if ((typeof favourite === "string") && (favourite.trim() !== "")) {
            this.#skills.push(favourite);
          }
        });
      }

      this.#firstNames = data.firstNames || this.#firstNames;
      this.#geohash = data.geohash || this.#geohash;
      this.#gitHubURL = data.gitHubURL || this.#gitHubURL;
      this.#isAdmin = typeof data.isAdmin === "boolean" ? data.isAdmin : this.#isAdmin;
      this.#isContractor = typeof data.isContractor === "boolean" ? data.isContractor : this.#isContractor;
      this.#isRecruiter = typeof data.isRecruiter === "boolean" ? data.isRecruiter : this.#isRecruiter;
      this.#lastLoggedOut = (data.lastLoggedOut ? enforceTimestamp(data.lastLoggedOut) : this.#lastLoggedOut);
      this.#lastName = data.lastName || this.#lastName;
      this.#linkedInURL = data.linkedInURL || this.#linkedInURL;
      this.#location = (data.location instanceof GeoPoint ? data.location : this.#location);
      this.#profileImageURL = data.profileImageURL || this.#profileImageURL;
      this.#profileAbout = data.profileAbout || this.#profileAbout;

      // Process projects array
      if (Array.isArray(data.projects)) {
        data.projects.forEach(project => {
          this.#projects.push(project instanceof Project ? project : new Project(project));
        });
      }

      // Process skills array
      if (Array.isArray(data.skills)) {
        data.skills.forEach(skill => {
          if ((typeof skill === "string") && (skill.trim() !== "")) {
            this.#skills.push(skill);
          }
        });
      }

      this.#specialization = data.specialization || this.#specialization;
      this.#videoURL = data.videoURL || this.#videoURL;
      this.#worksite_hybrid = typeof data.worksite_hybrid === "boolean" ? data.worksite_hybrid : this.#worksite_hybrid;
      this.#worksite_onSite = typeof data.worksite_onSite === "boolean" ? data.worksite_onSite : this.#worksite_onSite;
      this.#worksite_remote = typeof data.worksite_remote === "boolean" ? data.worksite_remote : this.#worksite_remote;

    } else {
      this.#availability = defaultAvailability;
    }
  }

  // Getters
  get availability() { return this.#availability; }
  get deletedOn() { return this.#deletedOn; }
  get email() { return this.#email; }
  get favourites() { return this.#favourites; }
  get firstNames() { return this.#firstNames; }
  get gitHubURL() { return this.#gitHubURL; }
  get isAdmin() { return this.#isAdmin; }
  get isContractor() { return this.#isContractor; }
  get isRecruiter() { return this.#isRecruiter; }
  get lastLoggedOut() { return this.#lastLoggedOut; }
  get lastName() { return this.#lastName; }
  get linkedInURL() { return this.#linkedInURL; }
  get location() { return this.#location; }
  get profileImageURL() { return this.#profileImageURL; }
  get profileAbout() { return this.#profileAbout; }
  get projects() { return this.#projects; }
  get skills() { return this.#skills; }
  get specialization() { return this.#specialization; }
  get videoURL() { return this.#videoURL; }
  get worksite_hybrid() { return this.#worksite_hybrid; }
  get worksite_onSite() { return this.#worksite_onSite; }
  get worksite_remote() { return this.#worksite_remote; }

  // Setters with validation
  set availability(value) {
    if (![User.AVAILABILITY_NOT_AVAILABLE, User.AVAILABILITY_PART_TIME, User.AVAILABILITY_FULL_TIME].includes(value)) {
      throw new Error("Invalid availability value");
    }

    this.#availability = value;
  }

  set deletedOn(value) {
    this.#deletedOn = enforceTimestamp(value);
  }

  set email(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#email = value;
  }

  set favourites(value) {
    if (!Array.isArray(value) || value.some((favourite) => typeof favourite!== "string" || favourite.trim() === "")) {
      throw new Error("Value must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#favourites = [...new Set(value.map((favourite) => favourite.trim()))]; // Remove duplicates using Set
  }

  set firstNames(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#firstNames = value;
  }

  set gitHubURL(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#gitHubURL = value;
  }

  set isAdmin(value) {
    if (typeof value!== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#isAdmin = value;
  }

  set isContractor(value) {
    if (typeof value!== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#isContractor = value;
  }

  set isRecruiter(value) {
    if (typeof value!== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#isRecruiter = value;
  }

  set lastLoggedOut(value) {
    this.#lastLoggedOut = enforceTimestamp(value);
  }

  set lastName(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#lastName = value;
  }

  set linkedInURL(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#linkedInURL = value;
  }

  set location(value) {
    if (!(value instanceof GeoPoint)) {
      throw new Error("Value must be a GeoPoint object");
    }

    this.#location = value;
    this.#geohash = geohashForLocation([value.latitude, value.longitude]);
  }

  set profileImageURL(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#profileImageURL = value;
  }

  set profileAbout(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#profileAbout = value;
  }

  set projects(value) {
	  if (!Array.isArray(value) || value.some((project) => !(project instanceof Project))) {
      throw new Error("Value must be an array of Project objects");
    }

    this.#projects = value;
  }

  set skills(value) {
    if (!Array.isArray(value) || value.some((skill) => typeof skill !== "string" || skill.trim() === "")) {
      throw new Error("Value must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#skills = [...new Set(value.map((skill) => skill.trim()))]; // Remove duplicates using Set
  }

  set specialization(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#specialization = value;
  }

  set videoURL(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#videoURL = value;
  }

  set worksite_hybrid(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_hybrid = !!value;
  }

  set worksite_onSite(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_onSite = !!value;
  }

  set worksite_remote(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_remote = !!value;
  }

  // Methods
  fullName(lastNameFirst = false) {
    return (lastNameFirst ? `${this.#lastName}, ${this.#firstNames}` : `${this.#firstNames} ${this.#lastName}`).trim();
  }

  isActive() {
    return this.#deletedOn === null;
  }

  worksitePreferences() {
    const preferences = [];

    if (this.#worksite_onSite) preferences.push(User.WORKSITE_TEXTS.onSite);
    if (this.#worksite_remote) preferences.push(User.WORKSITE_TEXTS.remote);
    if (this.#worksite_hybrid) preferences.push(User.WORKSITE_TEXTS.hybrid);

    return preferences;
  }

  availabilityToString() {
    return User.AVAILABILITY_TEXTS[this.#availability];
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    return {
      availability:  this.#availability,
      deletedOn:  this.#deletedOn,
      email:  this.#email,
      favourites:  this.#favourites,
      firstNames:  this.#firstNames,
      geohash:  this.#geohash,
      gitHubURL:  this.#gitHubURL,
      isAdmin:  this.#isAdmin,
      isContractor:  this.#isContractor,
      isRecruiter:  this.#isRecruiter,
      lastLoggedOut:  this.#lastLoggedOut,
      lastName:  this.#lastName,
      linkedInURL:  this.#linkedInURL,
      location:  this.#location,
      profileImageURL:  this.#profileImageURL,
      profileAbout:  this.#profileAbout,
      projects:  this.#projects.map((project) => project.toFirebaseDocument()),
      skills:  this.#skills,
      specialization:  this.#specialization,
      videoURL:  this.#videoURL,
      worksite_hybrid:  this.#worksite_hybrid,
      worksite_onSite:  this.#worksite_onSite,
      worksite_remote:  this.#worksite_remote
    };
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    const data = doc?.data();

    return data ? new User(data) : null;
  }
}

export default User;