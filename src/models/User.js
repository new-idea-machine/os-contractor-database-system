/**
 * @fileoverview User data model for managing contractor and recruiter profiles.
 *
 * This module implements the User class, providing comprehensive functionality for storing and
 * managing user profile information in the contractor database system. The class supports both
 * contractor and recruiter roles, with fields for personal information, professional details,
 * location data, project history, and work preferences.
 *
 * The User model integrates with other data models including Location for geographical data
 * and Project for portfolio management. It provides automatic serialization for Firebase
 * Firestore operations and includes validation for all settable properties.
 *
 * Key features:
 * - Dual role support (contractor and recruiter profiles)
 * - Comprehensive profile management with validation
 * - Integration with Location and Project models
 * - Automatic Firebase document conversion
 * - Work preference and availability tracking
 * - Soft delete functionality with deletedOn timestamp
 * - Skills and favourites management with duplicate prevention
 * - Firebase-compatible document serialization
 *
 * @example
 * import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
 * import { db } from "../firebase";
 * import User from "../models/User";
 *
 * // Fetch a user document with automatic conversion
 *
 * const userRef = doc(db, "users", userId).withConverter(User.firebaseConverter);
 * const userSnap = await getDoc(userRef);
 * const user = userSnap.data();  // Already a User instance
 *
 * // Access user data
 *
 * console.log(`Name:  ${user.fullName()}`);
 * console.log(`Email:  ${user.email}`);
 * console.log(`Availability:  ${user.availabilityToString()}`);
 * console.log(`Work Preferences:  ${user.worksitePreferences().join(", ")}`);
 *
 * // Update user properties and save back to Firebase (automatic conversion to plain object)
 *
 * user.availability = User.AVAILABILITY_FULL_TIME;
 * user.worksite_remote = true;
 * user.worksite_hybrid = true;
 * await setDoc(userRef, user);
 *
 * // Or update specific fields without converter
 *
 * const newUserData = user.toFirebaseDocument();
 * newUserData.email = "null@void.org";
 * await updateDoc(doc(db, "users", userId), newUserData);
 *
 * @module models/User
 * @requires firebase/firestore
 * @requires models/Location
 * @requires models/Project
 * @requires constants/data
 */

import {
  isValidEmailAddress,
  isValidURL,
  isValidFirebaseUserUID,
  enforceTrimmedString,
  enforceTimestamp,
  parseStringsArray
} from "../constants/data";
import { Location } from "./Location";
import { Project } from "./Project";

/**
 * User model for storing contractor and recruiter profile information.
 *
 * Manages comprehensive user data including personal information, professional details,
 * location, projects, skills, and work preferences. Supports both contractor and recruiter
 * roles with appropriate fields for each.
 *
 * A user can only modify their own instance, and they can't grant themselves administrator
 * status.
 * @class User
 */
class User {
  // Static constants

  /**
   * Availability status:  Not available for work
   * @static
   * @constant {number}
   */
  static AVAILABILITY_NOT_AVAILABLE = 0;

  /**
   * Availability status:  Available for part-time work
   * @static
   * @constant {number}
   */
  static AVAILABILITY_PART_TIME = 1;

  /**
   * Availability status:  Available for full-time work
   * @static
   * @constant {number}
   */
  static AVAILABILITY_FULL_TIME = 2;

  /**
   * Human-readable text representations of availability statuses
   * @static
   * @constant {string[]}
   */
  static AVAILABILITY_TEXTS = ["Not Available", "Part Time", "Full Time"];

  /**
   * Human-readable text representations of worksite preferences
   * @static
   * @constant {Object}
   * @property {string} onSite - On-site work preference text
   * @property {string} remote - Remote work preference text
   * @property {string} hybrid - Hybrid work preference text
   */
  static WORKSITE_TEXTS = { onSite: "On-Site", remote: "Remote", hybrid: "Hybrid" };

  // Static private members

  /**
   * Current authenticated user's ID (set once during app initialization)
   * @private
   * @static
   * @type {?string}
   */
  static #currentUserId = null;

  // Static getters

  /**
   * Get the current user's ID.
   * @static
   * @returns {?string} Current user ID, or null if not set
   */
  static get currentUserId() {
    return User.#currentUserId;
  }

  // Static setters

  /**
   * Set the current user ID context for all User instances.
   *
   * This should be set whenever a user logs in or logs out.
   *
   * @static
   * @param {?string} userId - The authenticated user's ID, or null to clear
   * @throws {Error} If userId is not valid
   * @example
   * import { UserAuth } from '../contexts/Authorization';
   * import User from '../models/User';
   *
   * function App() {
   *   const { userId } = UserAuth();
   *
   *   useEffect(() => {
   *     User.currentUserId = userId;
   *   }, [userId]);
   * }
   */
  static set currentUserId(userId) {
    if ((userId !== null) && !isValidFirebaseUserUID(userId)) {
      throw new Error("userId must be either null or a valid Firebase UserUID");
    }

    User.#currentUserId = userId;
  }

  // Private members

  /**
   * User's unique identifier (Firebase Firestore document ID)
   * @private
   * @type {string}
   */
  #userId = null;

  /**
   * User's availability-for-work status (see constructor for default value)
   * @private
   * @type {number}
   */
  #availability;

  /**
   * Timestamp when the user account was soft-deleted (null if active)
   * @private
   * @type {?Timestamp}
   */
  #deletedOn = null;

  /**
   * User's email address
   * @private
   * @type {string}
   */
  #email = "";

  /**
   * Array of user IDs that this user has marked as favourites
   * @private
   * @type {string[]}
   */
  #favourites = [];

  /**
   * User's first name(s)
   * @private
   * @type {string}
   */
  #firstNames = "";

  /**
   * URL to user's GitHub profile
   * @private
   * @type {string}
   */
  #gitHubURL = "";

  /**
   * Does the user have administrator privileges?
   * @private
   * @type {boolean}
   */
  #isAdmin = false;

  /**
   * Is the user a contractor?
   * @private
   * @type {boolean}
   */
  #isContractor = false;

  /**
   * Is the user a recruiter?
   * @private
   * @type {boolean}
   */
  #isRecruiter = false;

  /**
   * Timestamp of the user's last logout
   * @private
   * @type {?Timestamp}
   */
  #lastLoggedOut = null;

  /**
   * User's last name (surname)
   * @private
   * @type {string}
   */
  #lastName = "";

  /**
   * URL to user's LinkedIn profile
   * @private
   * @type {string}
   */
  #linkedInURL = "";

  /**
   * User's geographical location
   * @private
   * @type {?Location}
   */
  #location = null;

  /**
   * URL to user's profile image
   * @private
   * @type {string}
   */
  #profileImageURL = "";

  /**
   * User's profile "About" section text
   * @private
   * @type {string}
   */
  #profileAbout = "";

  /**
   * Array of user's projects
   * @private
   * @type {Project[]}
   */
  #projects = [];

  /**
   * Array of user's skills
   * @private
   * @type {string[]}
   */
  #skills = [];

  /**
   * User's professional specialization
   * @private
   * @type {string}
   */
  #specialization = "";

  /**
   * URL to user's profile video
   * @private
   * @type {string}
   */
  #videoURL = "";

  /**
   * Is the user open to hybrid remote & on-site work arrangements?
   * @private
   * @type {boolean}
   */
  #worksite_hybrid = false;

  /**
   * Is the user open to just on-site work?
   * @private
   * @type {boolean}
   */
  #worksite_onSite = false;

  /**
   * Is the user open to just remote work?
   * @private
   * @type {boolean}
   */
  #worksite_remote = false;

  // Constructor

  /**
   * Create a new User instance.
   *
   * @constructor
   * @param {string} userId - User ID for this instance
   * @param {Object} [data={}] - User data object
   * @param {number} [data.availability] - Availability status (use static constants)
   * @param {Timestamp} [data.deletedOn] - Soft delete timestamp
   * @param {string} [data.email] - Email address
   * @param {string[]} [data.favourites] - Array of favourite user IDs
   * @param {string} [data.firstNames] - First name(s)
   * @param {string} [data.gitHubURL] - GitHub profile URL
   * @param {boolean} [data.isAdmin] - Administrator flag
   * @param {boolean} [data.isContractor] - Contractor role flag
   * @param {boolean} [data.isRecruiter] - Recruiter role flag
   * @param {Timestamp} [data.lastLoggedOut] - Last logout timestamp
   * @param {string} [data.lastName] - Last name
   * @param {string} [data.linkedInURL] - LinkedIn profile URL
   * @param {Location|Object} [data.location] - Location instance or location data
   * @param {string} [data.profileImageURL] - Profile image URL
   * @param {string} [data.profileAbout] - Profile about text
   * @param {Array<Project|Object>} [data.projects] - Array of Project instances or project data
   * @param {string[]} [data.skills] - Array of skill strings
   * @param {string} [data.specialization] - Professional specialization
   * @param {string} [data.videoURL] - Profile video URL
   * @param {boolean} [data.worksite_hybrid] - Hybrid work preference
   * @param {boolean} [data.worksite_onSite] - On-site work preference
   * @param {boolean} [data.worksite_remote] - Remote work preference
   */
  constructor(userId, data = {}) {
    const defaultAvailability = User.AVAILABILITY_NOT_AVAILABLE;

    if (!isValidFirebaseUserUID(userId)) {
      throw new Error(`${userId} is not a valid Firebase User UID`);
    }

    this.#userId = userId;

    /*
    This constructor considers the possibility that data may be invalid or missing and will add
    default values to its members where necessary to maintain data integrity.
    */

    if (typeof data === "object" && !Array.isArray(data)) {
      this.#availability = (data.availability !== undefined ? data.availability : defaultAvailability);
      this.#deletedOn = enforceTimestamp(data.deletedOn);
      this.#email = (typeof data.email === "string" ? data.email : this.#email);

      parseStringsArray(data.favourites, this.#favourites);

      this.#firstNames = (typeof data.firstNames === "string" ? data.firstNames : this.#firstNames);
      this.#gitHubURL = (typeof data.gitHubURL === "string" ? data.gitHubURL : this.#gitHubURL);
      this.#isAdmin = (typeof data.isAdmin === "boolean" ? data.isAdmin : this.#isAdmin);
      this.#isContractor = (typeof data.isContractor === "boolean" ? data.isContractor : this.#isContractor);
      this.#isRecruiter = (typeof data.isRecruiter === "boolean" ? data.isRecruiter : this.#isRecruiter);
      this.#lastLoggedOut = enforceTimestamp(data.lastLoggedOut);
      this.#lastName = (typeof data.lastName === "string" ? data.lastName : this.#lastName);
      this.#linkedInURL = (typeof data.linkedInURL === "string" ? data.linkedInURL : this.#linkedInURL);

      if (data.location) {
      	this.#location = data.location instanceof Location ? data.location : new Location(data.location);
      }

      this.#profileImageURL = (typeof data.profileImageURL === "string" ? data.profileImageURL : this.#profileImageURL);
      this.#profileAbout = (typeof data.profileAbout === "string" ? data.profileAbout : this.#profileAbout);

      if (Array.isArray(data.projects)) {
        data.projects.forEach(project => {
          try {
            this.#projects.push(project instanceof Project ? project : new Project(project, userId));
          } catch {}
        });
      }

      parseStringsArray(data.skills, this.#skills);

      this.#specialization = (typeof data.specialization === "string" ? data.specialization : this.#specialization);
      this.#videoURL = (typeof data.videoURL === "string" ? data.videoURL : this.#videoURL);
      this.#worksite_hybrid = (typeof data.worksite_hybrid === "boolean" ? data.worksite_hybrid : this.#worksite_hybrid);
      this.#worksite_onSite = (typeof data.worksite_onSite === "boolean" ? data.worksite_onSite : this.#worksite_onSite);
      this.#worksite_remote = (typeof data.worksite_remote === "boolean" ? data.worksite_remote : this.#worksite_remote);

    } else {
      this.#availability = defaultAvailability;
    }
  }

  // Getters

  /**
   * Get the user's ID.
   * @returns {string} User ID
   */
  get userId() { return this.#userId; }

  /**
   * Get the user's availability-for-work status.
   * @returns {number} Availability status (use static AVAILABILITY_* constants to interpret)
   */
  get availability() { return this.#availability; }

  /**
   * Get the timestamp when the user account was soft-deleted.
   * @returns {?Timestamp} Deletion timestamp, or null if the account is active
   */
  get deletedOn() { return this.#deletedOn; }

  /**
   * Get the user's email address.
   * @returns {string} Email address
   */
  get email() { return this.#email; }

  /**
   * Get the array of user IDs that this user has marked as favourites.
   *
   * When manipulating this array, DO NOT put anything other than user ID strings in it because
   * no consistency-checking is performed.  Anything that isn't a string will be discarded when
   * the User instance's Firebase document is updated.
   * @returns {string[]} Array of favourite user IDs
   */
  get favourites() { return (this.currentUserCanModify() ? this.#favourites : structuredClone(this.#favourites)); }

  /**
   * Get the user's first name(s).
   * @returns {string} First name(s)
   */
  get firstNames() { return this.#firstNames; }

  /**
   * Get the URL to the user's GitHub profile.
   * @returns {string} GitHub profile URL
   */
  get gitHubURL() { return this.#gitHubURL; }

  /**
   * Is the user account active (not soft-deleted)?
   * @returns {boolean} True if the account is active, false if deleted
   */
  get isActive() { return this.#deletedOn === null; }

  /**
   * Is the user is an administrator?
   * @returns {boolean} True if the user is an administrator
   */
  get isAdmin() { return this.#isAdmin; }

  /**
   * Is the user a contractor?
   * @returns {boolean} True if the user is a contractor
   */
  get isContractor() { return this.#isContractor; }

  /**
   * Is the user is a recruiter?
   * @returns {boolean} True if the user is a recruiter
   */
  get isRecruiter() { return this.#isRecruiter; }

  /**
   * Get the timestamp of the user's last logout.
   * @returns {?Timestamp} Last logout timestamp, or null if never logged out
   */
  get lastLoggedOut() { return this.#lastLoggedOut; }

  /**
   * Get the user's last name (surname).
   * @returns {string} Last name
   */
  get lastName() { return this.#lastName; }

  /**
   * Get the URL to the user's LinkedIn profile.
   * @returns {string} LinkedIn profile URL
   */
  get linkedInURL() { return this.#linkedInURL; }

  /**
   * Get the user's geographical location.
   * @returns {?Location} Location instance, or null if not set
   */
  get location() { return this.#location; }

  /**
   * Get the URL to the user's profile image.
   * @returns {string} Profile image URL
   */
  get profileImageURL() { return this.#profileImageURL; }

  /**
   * Get the user's profile "About" section text.
   * @returns {string} Profile about text
   */
  get profileAbout() { return this.#profileAbout; }

  /**
   * Get the array of the user's projects.
   *
   * When manipulating this array, DO NOT put anything other than Project instances in it
   * because no consistency-checking is performed.  Anything that isn't a Project instance will
   * be discarded when the User instance's Firebase document is updated.
   * @returns {Project[]} Array of Project instances
   */
  get projects() { return (this.currentUserCanModify() ? this.#projects : structuredClone(this.#projects)); }

  /**
   * Get the array of the user's skills.
   *
   * When manipulating this array, DO NOT put anything other than strings in it because no
   * consistency-checking is performed.  Anything that isn't a string will be discarded when
   * the User instance's Firebase document is updated.
   * @returns {string[]} Array of skill strings
   */
  get skills() { return (this.currentUserCanModify() ? this.#skills : structuredClone(this.#skills)); }

  /**
   * Get the user's professional specialization.
   * @returns {string} Professional specialization
   */
  get specialization() { return this.#specialization; }

  /**
   * Get the URL to the user's profile video.
   * @returns {string} Profile video URL
   */
  get videoURL() { return this.#videoURL; }

  /**
   * Check if the user is open to hybrid work arrangements (combination of remote and on-site).
   * @returns {boolean} True if the user accepts hybrid work
   */
  get worksite_hybrid() { return this.#worksite_hybrid; }

  /**
   * Check if the user is open to on-site work only.
   * @returns {boolean} True if the user accepts on-site work
   */
  get worksite_onSite() { return this.#worksite_onSite; }

  /**
   * Check if the user is open to remote work only.
   * @returns {boolean} True if the user accepts remote work
   */
  get worksite_remote() { return this.#worksite_remote; }

  // Setters with validation

  /**
   * Set the user's availability status for work.
   * @param {number} value - Availability status (must be one of the static AVAILABILITY_* constants)
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a valid availability constant
   */
  set availability(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (![User.AVAILABILITY_NOT_AVAILABLE, User.AVAILABILITY_PART_TIME, User.AVAILABILITY_FULL_TIME].includes(value)) {
      throw new Error("Invalid availability value");
    }

    this.#availability = value;
  }

  /**
   * Set the timestamp when the user account was soft-deleted.
   * @param {Timestamp|Date|null} value - Deletion timestamp (will be converted to Firestore Timestamp)
   * @throws {Error} If the current user is not permitted to modify this instance
   */
  set deletedOn(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    this.#deletedOn = enforceTimestamp(value);
  }

  /**
   * Set the user's email address.
   * @param {string} value - Email address
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set email(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (!isValidEmailAddress(value)) {
      throw new Error("Value must be a valid e-mail address");
    }

    this.#email = value;
  }

  /**
   * Set the array of user IDs that this user has marked as favourites.
   * Automatically removes duplicates.
   * @param {string[]} value - Array of favourite user IDs (must be valid Firebase user ID's)
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not an array of valid Firebase user ID's
   */
  set favourites(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (!Array.isArray(value) || value.some((favourite) => !isValidFirebaseUserUID(favourite))) {
      throw new Error("Value must be an array of valid Firebase user ID's");
    }

    this.#favourites = [...new Set(value)]; // Remove duplicates using Set
  }

  /**
   * Set the user's first name(s).
   * @param {string} value - First name(s)
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set firstNames(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (newValue === "") {
      throw new Error("Value must be a non-empty string");
    }

    this.#firstNames = newValue;
  }

  /**
   * Set the URL to the user's GitHub profile.
   * @param {string} value - GitHub profile URL
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set gitHubURL(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (!isValidURL(newValue)) {
      throw new Error("Value must be a valid uniform resource locator");
    }

    this.#gitHubURL = newValue;
  }

  /**
   * Set whether the user is an administrator.
   * @param {boolean} value - Administrator flag
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a boolean
   */
  set isAdmin(value) {
    if (!this.#isAdmin || !this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#isAdmin = value;
  }

  /**
   * Set whether the user is a contractor.
   * @param {boolean} value - Contractor role flag
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a boolean
   */
  set isContractor(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#isContractor = value;
  }

  /**
   * Set whether the user is a recruiter.
   * @param {boolean} value - Recruiter role flag
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a boolean
   */
  set isRecruiter(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#isRecruiter = value;
  }

  /**
   * Set the timestamp of the user's last logout.
   * @param {Timestamp|Date|null} value - Last logout timestamp (will be converted to Firestore Timestamp)
   * @throws {Error} If the current user is not permitted to modify this instance
   */
  set lastLoggedOut(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    this.#lastLoggedOut = enforceTimestamp(value);
  }

  /**
   * Set the user's last name (surname).
   * @param {string} value - Last name
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set lastName(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (newValue === "") {
      throw new Error("Value must be a non-empty string");
    }

    this.#lastName = newValue;
  }

  /**
   * Set the URL to the user's LinkedIn profile.
   * @param {string} value - LinkedIn profile URL
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set linkedInURL(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (!isValidURL(newValue)) {
      throw new Error("Value must be a valid uniform resource locator");
    }

    this.#linkedInURL = newValue;
  }

  /**
   * Set the user's geographical location.
   * @param {Location|null} value - Location instance, or null to clear location
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is neither null nor a Location instance
   */
  set location(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if ((value !== null) && !(value instanceof Location)) {
      throw new Error("Value must be either null or a Location instance");
    }

    this.#location = value;
  }

  /**
   * Set the URL to the user's profile image.
   * @param {string} value - Profile image URL
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set profileImageURL(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (!isValidURL(newValue)) {
      throw new Error("Value must be a valid uniform resource locator");
    }

    this.#profileImageURL = newValue;
  }

  /**
   * Set the user's profile "About" section text.
   * @param {string} value - Profile about text
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set profileAbout(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#profileAbout = value;
  }

  /**
   * Set the array of the user's projects.
   * @param {Project[]} value - Array of Project instances
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not an array of Project instances
   * @throws {Error} If any projects have duplicate titles
   */
  set projects(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (!Array.isArray(value) || value.some((project) => !(project instanceof Project))) {
      throw new Error("Value must be an array of Project objects");
    }

    for (let i = 0; i < value.length - 1; i++) {
      if (value.findLastIndex((project) => project.title === value[i].title) !== i) {
        throw new Error("Each project in array must have a unique title");
      }
    }

    this.#projects = value;
  }

  /**
   * Set the array of the user's skills.
   * Automatically removes duplicates and trims whitespace from each skill.
   * @param {string[]} value - Array of skill strings (must be non-empty strings)
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not an array of non-empty strings
   */
  set skills(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (!Array.isArray(value) || value.some((skill) => enforceTrimmedString(skill) === "")) {
      throw new Error("Value must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#skills = [...new Set(value.map((skill) => skill.trim()))]; // Remove duplicates using Set
  }

  /**
   * Set the user's professional specialization.
   * @param {string} value - Professional specialization
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set specialization(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (newValue === "") {
      throw new Error("Value must be a non-empty string");
    }

    this.#specialization = newValue;
  }

  /**
   * Set the URL to the user's profile video.
   * @param {string} value - Profile video URL
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a string
   */
  set videoURL(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    const newValue = enforceTrimmedString(value);

    if (!isValidURL(newValue)) {
      throw new Error("Value must be a valid uniform resource locator");
    }

    this.#videoURL = newValue;
  }

  /**
   * Set whether the user is open to hybrid work arrangements (combination of remote and on-site).
   * @param {boolean} value - Hybrid work preference flag
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a boolean
   */
  set worksite_hybrid(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_hybrid = value;
  }

  /**
   * Set whether the user is open to on-site work only.
   * @param {boolean} value - On-site work preference flag
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a boolean
   */
  set worksite_onSite(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_onSite = value;
  }

  /**
   * Set whether the user is open to remote work only.
   * @param {boolean} value - Remote work preference flag
   * @throws {Error} If the current user is not permitted to modify this instance
   * @throws {Error} If value is not a boolean
   */
  set worksite_remote(value) {
    if (!this.currentUserCanModify()) {
      throw new Error("Current user is not permitted to modify this instance");
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_remote = value;
  }

  // Methods

  /**
   * Checks if the current user is allowed to modify this instance.
   *
   * @returns {boolean} True if the current user can make modifications, false otherwise
   */
  currentUserCanModify() {
    return User.currentUserId === this.#userId;
  }
  /**
   * Get the user's full name in the specified format.
   *
   * @param {boolean} [lastNameFirst=false] - If true, returns "LastName, FirstNames" format; otherwise "FirstNames LastName"
   * @returns {string} The user's full name, trimmed of excess whitespace
   */
  fullName(lastNameFirst = false) {
    return (lastNameFirst ? `${this.#lastName}, ${this.#firstNames}` : `${this.#firstNames} ${this.#lastName}`).trim();
  }

  /**
   * Get an array of the user's worksite preferences as human-readable strings.
   *
   * @returns {string[]} Array of worksite preference strings (e.g., ["On-Site", "Remote", "Hybrid"])
   */
  worksitePreferencesToStrings() {
    const preferences = [];

    if (this.#worksite_onSite) preferences.push(User.WORKSITE_TEXTS.onSite);
    if (this.#worksite_remote) preferences.push(User.WORKSITE_TEXTS.remote);
    if (this.#worksite_hybrid) preferences.push(User.WORKSITE_TEXTS.hybrid);

    return preferences;
  }

  /**
   * Convert the user's availability status to a human-readable string.
   *
   * @returns {string} Human-readable availability status (e.g., "Full Time", "Part Time", "Not Available")
   */
  availabilityToString() {
    return User.AVAILABILITY_TEXTS[this.#availability];
  }

  /**
   * Convert the User instance to a plain object suitable for storing in Firebase.
   *
   * This method serializes all user data, including nested Location and Project objects,
   * into a format that can be directly written to Firebase or embedded in other documents.
   *
   * @returns {Object} Plain object representation of the user data
   */
  toFirebaseDocument() {
    return {
      availability:  this.#availability,
      deletedOn:  this.#deletedOn,
      email:  this.#email,
      favourites:  this.#favourites.filter((favourite) => isValidFirebaseUserUID(favourite)),
      firstNames:  this.#firstNames,
      gitHubURL:  this.#gitHubURL,
      isAdmin:  this.#isAdmin,
      isContractor:  this.#isContractor,
      isRecruiter:  this.#isRecruiter,
      lastLoggedOut:  this.#lastLoggedOut,
      lastName:  this.#lastName,
      linkedInURL:  this.#linkedInURL,
      location:  this.#location?.toFirebaseDocument(),
      profileImageURL:  this.#profileImageURL,
      profileAbout:  this.#profileAbout,
      projects:  this.#projects.filter((project) => project instanceof Project).map((project) => project.toFirebaseDocument()),
      skills:  this.#skills.map((skill) => enforceTrimmedString(skill)).filter((skill) => skill !== ""),
      specialization:  this.#specialization,
      videoURL:  this.#videoURL,
      worksite_hybrid:  this.#worksite_hybrid,
      worksite_onSite:  this.#worksite_onSite,
      worksite_remote:  this.#worksite_remote
    };
  }

  /**
   * Firestore converter for automatic serialization and deserialization of User instances.
   *
   * Use this converter with Firestore document references to automatically convert between
   * User instances and Firestore documents.  This is the recommended approach for Firestore
   * operations.
   *
   * @static
   * @type {Object}
   * @property {Function} fromFirestore - Converts Firestore document to User instance
   * @property {Function} toFirestore - Converts User instance to Firestore document
   * @example
   * const userRef = doc(db, "users", userId).withConverter(User.firebaseConverter);
   *
   * // Reading returns a User instance
   *
   * const userSnap = await getDoc(userRef);
   * const user = userSnap.data();  // Returns User instance
   *
   * // Writing accepts a User instance
   *
   * const newUser = new User({ firstNames: "John", lastName: "Doe" });
   * await setDoc(userRef, newUser);
   */
  static firebaseConverter = {
    fromFirestore:  (snapshot, options) => new User(snapshot.id, snapshot.data(options)),
    toFirestore:  (user) => user.toFirebaseDocument()
  };
}

export default User;
