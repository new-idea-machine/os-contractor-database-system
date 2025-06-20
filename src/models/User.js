import { isValidTimestamp } from "../constants/data";
import { Project } from "./Project";
import Location from "./Location";

class User {
  static AVAILABILITY_NOT_AVAILABLE = 0;
  static AVAILABILITY_PART_TIME = 1;
  static AVAILABILITY_FULL_TIME = 2;
  static AVAILABILITY_TEXTS = ["Not Available", "Part Time", "Full Time"];
  static WORKSITE_TEXTS = { onSite: "On-Site", remote: "Remote", hybrid: "Hybrid" };

  // Private fields
  #availability; // See constructor for default value
  #deletedOn = null;
  #email = "";
  #favourites = [];
  #firstNames = "";
  #gitHubURL = "";
  #isAdmin = false;
  #isContractor = false;
  #isRecruiter = false;
  #lastLoggedOut = null;
  #lastName = "";
  #linkedInURL = "";
  #location = null;
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
      this.#deletedOn = data.deletedOn || this.#deletedOn;
      this.#email = data.email || this.#email;
      this.#favourites = Array.isArray(data.favourites) ? [...data.favourites] : this.#favourites;
      this.#firstNames = data.firstNames || this.#firstNames;
      this.#gitHubURL = data.gitHubURL || this.#gitHubURL;
      this.#isAdmin = data.isAdmin !== undefined ? !!data.isAdmin : this.#isAdmin;
      this.#isContractor = data.isContractor !== undefined ? !!data.isContractor : this.#isContractor;
      this.#isRecruiter = data.isRecruiter !== undefined ? !!data.isRecruiter : this.#isRecruiter;
      this.#lastLoggedOut = data.lastLoggedOut || this.#lastLoggedOut;
      this.#lastName = data.lastName || this.#lastName;
      this.#linkedInURL = data.linkedInURL || this.#linkedInURL;

      // Handle location data
      if (data.location instanceof Location) {
        this.#location = data.location;
      } else if (data.location && typeof data.location === 'object') {
        this.#location = new Location(data.location);
      } else {
        this.#location = null;
      }

      this.#profileImageURL = data.profileImageURL || this.#profileImageURL;
      this.#profileAbout = data.profileAbout || this.#profileAbout;
      this.#specialization = data.specialization || this.#specialization;
      this.#videoURL = data.videoURL || this.#videoURL;
      this.#worksite_hybrid = data.worksite_hybrid !== undefined ? !!data.worksite_hybrid : this.#worksite_hybrid;
      this.#worksite_onSite = data.worksite_onSite !== undefined ? !!data.worksite_onSite : this.#worksite_onSite;
      this.#worksite_remote = data.worksite_remote !== undefined ? !!data.worksite_remote : this.#worksite_remote;

      // Process projects array
      this.#projects = [];
      if (Array.isArray(data.projects)) {
        data.projects.forEach(project => {
          this.#projects.push(project instanceof Project ? project : new Project(project));
        });
      }

      // Process skills array
      this.#skills = Array.isArray(data.skills) ? [...data.skills] : this.#skills;
    } else {
      this.#availability = defaultAvailability;
    }
  }

  // Getters
  get availability() { return this.#availability; }
  get deletedOn() { return this.#deletedOn; }
  get email() { return this.#email; }
  get favourites() { return [...this.#favourites]; }
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
  get projects() { return [...this.#projects]; }
  get skills() { return [...this.#skills]; }
  get specialization() { return this.#specialization; }
  get videoURL() { return this.#videoURL; }
  get worksite_hybrid() { return this.#worksite_hybrid; }
  get worksite_onSite() { return this.#worksite_onSite; }
  get worksite_remote() { return this.#worksite_remote; }

  get isActive() { return this.#deletedOn === null; }

  get worksitePreferences() {
    const preferences = [];
    if (this.#worksite_onSite) preferences.push(User.WORKSITE_TEXTS.onSite);
    if (this.#worksite_remote) preferences.push(User.WORKSITE_TEXTS.remote);
    if (this.#worksite_hybrid) preferences.push(User.WORKSITE_TEXTS.hybrid);
    return preferences;
  }

  get availabilityToString() {
    return User.AVAILABILITY_TEXTS[this.#availability];
  }

  // Setters with validation
  set availability(value) {
    if (![User.AVAILABILITY_NOT_AVAILABLE, User.AVAILABILITY_PART_TIME, User.AVAILABILITY_FULL_TIME].includes(value)) {
      throw new Error("Invalid availability value");
    }
    this.#availability = value;
  }

  set deletedOn(value) {
    if (value !== null && !isValidTimestamp(value)) {
      throw new Error("Timestamp must be null, a valid Date object or a valid timestamp");
    }
    this.#deletedOn = value;
  }

  set email(value) {
    if (typeof value !== "string") {
      throw new Error("Email must be a string");
    }
    this.#email = value;
  }

  set favourites(value) {
    if (!Array.isArray(value)) {
      throw new Error("ListOfFavourites must be an array");
    }
    this.#favourites = [...value];
  }

  set firstNames(value) {
    if (typeof value !== "string") {
      throw new Error("FirstNames must be a string");
    }
    this.#firstNames = value;
  }

  set gitHubURL(value) {
    if (typeof value !== "string") {
      throw new Error("GitHubURL must be a string");
    }
    this.#gitHubURL = value;
  }

  set isAdmin(value) {
    if (typeof value!== "boolean") {
      throw new Error("isAdmin must be a boolean");
    }
    this.#isAdmin = value;
  }

  set isContractor(value) {
    if (typeof value!== "boolean") {
      throw new Error("isContractor must be a boolean");
    }
    this.#isContractor = value;
  }

  set isRecruiter(value) {
    if (typeof value!== "boolean") {
      throw new Error("isRecruiter must be a boolean");
    }
    this.#isRecruiter = value;
  }

  set lastLoggedOut(value) {
    if (value !== null && !isValidTimestamp(value)) {
      throw new Error("LastLoggedOut must be null, a valid Date object or a valid timestamp");
    }
    this.#lastLoggedOut = value;
  }

  set lastName(value) {
    if (typeof value !== "string") {
      throw new Error("LastName must be a string");
    }
    this.#lastName = value;
  }

  set linkedInURL(value) {
    if (typeof value !== "string") {
      throw new Error("LinkedInURL must be a string");
    }
    this.#linkedInURL = value;
  }

  set location(value) {
    if (!(value instanceof Location)) {
      throw new Error("Location must be a Location instance");
    }
    this.#location = value;
  }

  set profileImageURL(value) {
    if (typeof value !== "string") {
      throw new Error("ProfileImageURL must be a string");
    }
    this.#profileImageURL = value;
  }

  set profileAbout(value) {
    if (typeof value !== "string") {
      throw new Error("ProfileAbout must be a string");
    }
    this.#profileAbout = value;
  }

  set projects(value) {
    if (!Array.isArray(value)) {
      throw new Error("Projects must be an array");
    }
    this.#projects = value.map(project => project instanceof Project ? project : new Project(project));
  }

  set skills(value) {
    if (!Array.isArray(value)) {
      throw new Error("Skills must be an array");
    }
    this.#skills = [...value];
  }

  set specialization(value) {
    if (typeof value !== "string") {
      throw new Error("Specialization must be a string");
    }
    this.#specialization = value;
  }

  set videoURL(value) {
    if (typeof value !== "string") {
      throw new Error("VideoURL must be a string");
    }
    this.#videoURL = value;
  }

  set worksite_hybrid(value) {
    this.#worksite_hybrid = !!value;
  }

  set worksite_onSite(value) {
    this.#worksite_onSite = !!value;
  }

  set worksite_remote(value) {
    this.#worksite_remote = !!value;
  }

  // Methods
  fullName(lastNameFirst = false) {
    return (lastNameFirst ? `${this.#lastName}, ${this.#firstNames}` : `${this.#firstNames} ${this.#lastName}`).trim();
  }

  addProject(project) {
    const projectObj = project instanceof Project ? project : new Project(project);
    this.#projects.push(projectObj);
  }

  removeProject(projectTitle) {
    this.#projects = this.#projects.filter((project) => project.title !== projectTitle);
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
    this.#skills = this.#skills.filter((element) => element !== skill);
  }

  addFavourite(id) {
    if (typeof id !== "string" || id.trim() === "") {
      throw new Error("Favourite ID must be a non-empty string");
    }

    if (!this.#favourites.includes(id)) {
      this.#favourites.push(id);
    }
  }

  removeFavourite(id) {
    this.#favourites = this.#favourites.filter((element) => element !== id);
  }

  isFavourite(id) {
    return this.#favourites.includes(id);
  }

  /**
   * Calculate distance to another location
   * @param {Location} location - The other location to calculate distance to
   * @returns {number|null} Distance (in kilometers) or null if user's
   *   location is unspecified
   */
  distanceTo(location) {
    if (!(location instanceof Location)) {
      throw new Error("Parameter must be a Location instance");
    }
    if (!this.#location) return null;

    return this.#location.distanceTo(location);
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    return {
      availability: this.#availability,
      deletedOn: this.#deletedOn,
      email: this.#email,
      favourites: this.#favourites,
      firstNames: this.#firstNames,
      gitHubURL: this.#gitHubURL,
      isAdmin: this.#isAdmin,
      isContractor: this.#isContractor,
      isRecruiter: this.#isRecruiter,
      lastLoggedOut: this.#lastLoggedOut,
      lastName: this.#lastName,
      linkedInURL: this.#linkedInURL,
      location: this.#location ? this.#location.toFirebaseDocument() : null,
      profileImageURL: this.#profileImageURL,
      profileAbout: this.#profileAbout,
      projects: this.#projects.map(project => project.toFirebaseDocument()),
      skills: this.#skills,
      specialization: this.#specialization,
      videoURL: this.#videoURL,
      worksite_hybrid: this.#worksite_hybrid,
      worksite_onSite: this.#worksite_onSite,
      worksite_remote: this.#worksite_remote
    };
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;

    const data = doc.data();
    if (!data) return null;

    return new User(data);
  }
}

export default User;