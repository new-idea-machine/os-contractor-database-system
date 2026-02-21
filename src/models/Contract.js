/**
 * @fileoverview Contract data model for managing job postings and contract opportunities.
 *
 * This model represents contract information that recruiters can post for contractors to view
 * and apply to.  It includes comprehensive information about the position, requirements,
 * compensation, and work arrangements.
 *
 * Key features:
 * - Comprehensive job posting details (title, description, requirements, responsibilities)
 * - Application tracking and status management
 * - Soft deletion support with timestamp tracking
 * - Location and worksite arrangement specifications (remote, on-site, hybrid)
 * - Skills and experience level requirements
 * - Compensation and contract duration details
 * - View count tracking for analytics
 * - Applicant management (apply, withdraw, check application status)
 * - Creator-only modification permissions
 *
 * @example
 * import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
 * import { db } from "../firebase";
 * import Contract from "../models/Contract";
 *
 * // Fetch a document from Firebase using automatic converter
 *
 * const contractRef = doc(db, "contracts", contractId).withConverter(Contract.firebaseConverter);
 * const contractSnap = await getDoc(contractRef);
 * const contract = contractSnap.data();  // Already a Contract instance
 *
 * // Access contract data
 *
 * console.log(`Author: ${contract.author}`);
 * console.log(`Text: ${contract.text}`);
 *
 * // Update contract properties and save back to Firebase (automatic conversion to plain object)
 *
 * contract.text = "This contract has been edited.";
 * await setDoc(contractRef, contract);
 *
 * // Or update specific fields without converter
 *
 * const newContractData = contract.toFirebaseDocument();
 * newContractData.text = "This contract has been edited without automatic conversion.";
 * await updateDoc(doc(db, "contracts", contractId), newContractData);
 *
 * @module models/Contract
 * @requires firebase/firestore
 * @requires constants/data
 * @requires models/Location
 */

import { serverTimestamp } from "firebase/firestore";
import {
  isValidTimestamp,
  enforceTrimmedString,
  enforceTimestamp,
  isValidFirebaseUserUID,
  parseStringsArray,
  contractApplicationStatusList,
  contractExperienceLevelsList,
  contractTypesList } from "../constants/data";
import { Location } from "./Location";

/**
 * Contract model for storing job posting and contract opportunity information.
 *
 * Manages comprehensive contract data including posting details, job requirements, location,
 * compensation, skills needed, and applicant tracking.  Supports soft deletion and status
 * tracking throughout the hiring lifecycle.
 *
 * @class Contract
 * @example
 * const contract = new Contract({
 *   title: "Senior React Developer",
 *   entityName: "Tech Solutions Inc.",
 *   contractType: "Fixed-Term",
 *   description: "Looking for an experienced React developer...",
 *   rate: "$85/hour"
 * });
 */
class Contract {
  // Static constants
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
    return Contract.#currentUserId;
  }

  // Static setters

  /**
   * Set the current user ID context for all Contract instances.
   *
   * This should be set whenever a user logs in or logs out.
   *
   * @static
   * @param {?string} userId - The authenticated user's ID, or null to clear
   * @throws {Error} If userId is not valid
   * @example
   * import { UserAuth } from '../contexts/Authorization';
   * import Contract from '../models/Contract';
   *
   * function App() {
   *   const { userId } = UserAuth();
   *
   *   useEffect(() => {
   *     Contract.currentUserId = userId;
   *   }, [userId]);
   * }
   */
  static set currentUserId(userId) {
    if ((userId !== null) && !isValidFirebaseUserUID(userId)) {
      throw new Error("userId must be either null or a valid Firebase UserUID");
    }

    Contract.#currentUserId = userId;
  }

  // Private members

  /**
   * Job title or position name
   * @private
   * @type {string}
   */
  #title = "";

  /**
   * Name of the entity (e.g. individual, company or organization ) offering the contract
   * @private
   * @type {string}
   */
  #entityName = "";

  /**
   * User ID of the recruiter who posted this contract
   * @private
   * @type {string}
   */
  #postedBy;  // See constructor for default value

  /**
   * Timestamp when the contract was posted
   * @private
   * @type {?Timestamp}
   */
  #postedOn = null;

  /**
   * Current status of the contract posting (must be one of the "contractApplicationStatusList"
   * constants)
   * @private
   * @type {string}
   */
  #applicationStatus = contractApplicationStatusList[0];

  /**
   * Type of contract being offered (must be one of the "contractTypesList" constants)
   * @private
   * @type {string}
   */
  #contractType = contractTypesList[0];

  /**
   * Geographical location of the work
   * @private
   * @type {?Location}
   */
  #location = null;

  /**
   * Is the work to be done both remotely & on-site?
   * @private
   * @type {boolean}
   */
  #worksite_hybrid = false;

  /**
   * Is the work to be done only on-site?
   * @private
   * @type {boolean}
   */
  #worksite_onSite = false;

  /**
   * Is the work to be done only remotely?
   * @private
   * @type {boolean}
   */
  #worksite_remote = false;

  /**
   * Additional details about work location or arrangement
   * @private
   * @type {string}
   */
  #worksiteDetails = "";

  /**
   * Number of positions available for this contract
   * @private
   * @type {number}
   */
  #numberOfPositions = 1;

  /**
   * Deadline for submitting applications
   * @private
   * @type {?Timestamp}
   */
  #applicationDeadline = null;

  /**
   * Detailed description of the contract position
   * @private
   * @type {string}
   */
  #description = "";

  /**
   * Key responsibilities for the role
   * @private
   * @type {string}
   */
  #responsibilities = "";

  /**
   * The specific requirements for the position
   * @private
   * @type {string}
   */
  #requirements = "";

  /**
   * Required experience level for the position (must be one of the "contractExperienceLevels"
   * constants)
   * @private
   * @type {string}
   */
  #experienceLevel = contractExperienceLevelsList[0];

  /**
   * Array of required skills for the position
   * @private
   * @type {string[]}
   */
  #skills = [];

  /**
   * Compensation rate (e.g., "$75/hour", "$5000/month")
   * @private
   * @type {string}
   */
  #rate = "";

  /**
   * Expected or actual start date for the contract
   * @private
   * @type {?Timestamp}
   */
  #startDate = null;

  /**
   * Duration of the contract (e.g., "6 months", "1 year")
   * @private
   * @type {string}
   */
  #duration = "";

  /**
   * Timestamp when the contract was soft-deleted (null if active)
   * @private
   * @type {?Timestamp}
   */
  #deletedOn = null;

  /**
   * Array of user IDs who have applied to this contract
   * @private
   * @type {string[]}
   */
  #applicants = [];

  /**
   * Number of times this contract posting has been viewed
   * @private
   * @type {number}
   */
  #viewCount = 0;

  // Constructor

  /**
   * Create a new Contract instance.
   *
   * Contract model for storing job posting and contract opportunity information.
   *
   * Manages comprehensive contract data including posting details, job requirements, location,
   * compensation, skills needed, and applicant tracking.  Supports soft deletion and status
   * tracking throughout the hiring lifecycle.
   *
   * @constructor
   * @param {Object} [data={}] - Contract data object
   * @param {string} [data.title] - Job title
   * @param {string} [data.entityName] - Entity name
   * @param {string} [data.postedBy] - User ID of the recruiter who posted this contract
   * @param {Timestamp} [data.postedOn] - Posting timestamp
   * @param {string} [data.applicationStatus] - Contract application status
   * @param {string} [data.contractType] - Type of contract
   * @param {Location|Object} [data.location] - Location instance or location data
   * @param {boolean} [data.worksite_hybrid] - Hybrid work required
   * @param {boolean} [data.worksite_onSite] - On-site work required
   * @param {boolean} [data.worksite_remote] - Remote work required
   * @param {string} [data.worksiteDetails] - Additional worksite details
   * @param {number} [data.numberOfPositions] - Number of positions available
   * @param {Timestamp} [data.applicationDeadline] - Application deadline
   * @param {string} [data.description] - Job description
   * @param {string} [data.responsibilities] - Role responsibilities
   * @param {string} [data.requirements] - Position requirements
   * @param {string} [data.experienceLevel] - Required experience level
   * @param {string[]} [data.skills] - Required skills
   * @param {string} [data.rate] - Compensation rate (e.g., "$75/hour")
   * @param {Timestamp} [data.startDate] - Expected or actual start date
   * @param {string} [data.duration] - Contract duration (e.g., "6 months")
   * @param {Timestamp} [data.deletedOn] - Soft delete timestamp
   * @param {string[]} [data.applicants] - Array of applicant user IDs
   * @param {number} [data.viewCount] - View count
   */
  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      this.#title = (typeof data.title === "string" ? data.title : this.#title);
      this.#entityName = (typeof data.entityName === "string" ? data.entityName : this.#entityName);
      this.#postedBy = (isValidFirebaseUserUID(data.postedBy) ? data.postedBy : Contract.#currentUserId);
      this.#postedOn = enforceTimestamp(data.postedOn);
      this.#applicationStatus = (contractApplicationStatusList.includes(data.applicationStatus) ? data.status : this.#applicationStatus);
      this.#contractType = (contractTypesList.includes(data.contractType) ? data.contractType : this.#contractType);
      this.#location = data?.location instanceof Location ? data.location : new Location(data?.location);
      this.#worksite_hybrid = (typeof data.worksite_hybrid === "boolean" ? data.worksite_hybrid : this.#worksite_hybrid);
      this.#worksite_onSite = (typeof data.worksite_onSite === "boolean" ? data.worksite_onSite : this.#worksite_onSite);
      this.#worksite_remote = (typeof data.worksite_remote === "boolean" ? data.worksite_remote : this.#worksite_remote);
      this.#worksiteDetails = (typeof data.worksiteDetails === "string" ? data.worksiteDetails : this.#worksiteDetails);
      this.#numberOfPositions = (typeof data.numberOfPositions === "number" ? parseInt(data.numberOfPositions) : this.#numberOfPositions);
      this.#applicationDeadline = enforceTimestamp(data.applicationDeadline);
      this.#description = (typeof data.description === "string" ? data.description : this.#description);
      this.#responsibilities = (typeof data.responsibilities === "string" ? data.responsibilities : this.#responsibilities);
      this.#requirements = (typeof data.requirements === "string" ? data.requirements : this.#requirements);
      this.#experienceLevel = (contractExperienceLevelsList.includes(data.experienceLevel) ? data.experienceLevel : this.#experienceLevel);

      parseStringsArray(data.skills, this.#skills);

      this.#rate = (typeof data.rate === "string" ? data.rate : this.#rate);
      this.#startDate = enforceTimestamp(data.startDate);
      this.#duration = (typeof data.duration === "string" ? data.duration : this.#duration);
      this.#deletedOn = enforceTimestamp(data.deletedOn);

      if (Array.isArray(data.applicants)) {
        parseStringsArray(data.applicants.filter((applicant) => isValidFirebaseUserUID(applicant)), this.#applicants);
      }

      this.#viewCount = (typeof data.viewCount === "number" ? parseInt(data.viewCount) : this.#viewCount);
    }
  }

  // Getters

  /**
   * Get the job title or position name.
   * @returns {string} The contract title
   */
  get title() { return this.#title; }

  /**
   * Get the name of the entity offering the contract.
   * @returns {string} The entity name
   */
  get entityName() { return this.#entityName; }

  /**
   * Get the user ID of the recruiter who posted this contract.
   * @returns {string} The poster's user ID
   */
  get postedBy() { return this.#postedBy; }

  /**
   * Get the timestamp when the contract was posted.
   * @returns {?Timestamp} The posting timestamp, or null if not set
   */
  get postedOn() { return this.#postedOn; }

  /**
   * Get the current status of the contract posting.
   * @returns {string} The application status
   */
  get applicationStatus() { return this.#applicationStatus; }

  /**
   * Get the type of contract being offered.
   * @returns {string} The contract type
   */
  get contractType() { return this.#contractType; }

  /**
   * Get the geographical location of the work.
   * @returns {?Location} The location instance, or null if not set
   */
  get location() { return this.#location; }

  /**
   * Check if hybrid work arrangement is an option.
   * @returns {boolean} True if hybrid work is an option, false if it isn't available
   */
  get worksite_hybrid() { return this.#worksite_hybrid; }

  /**
   * Check if on-site work is an option.
   * @returns {boolean} True if on-site work is an option, false if it isn't available
   */
  get worksite_onSite() { return this.#worksite_onSite; }

  /**
   * Check if remote work is an option.
   * @returns {boolean} True if remote work is an option, false if it isn't available
   */
  get worksite_remote() { return this.#worksite_remote; }

  /**
   * Get additional details about work location or arrangement.
   * @returns {string} The worksite details
   */
  get worksiteDetails() { return this.#worksiteDetails; }

  /**
   * Get the number of positions available for this contract.
   * @returns {number} The number of positions
   */
  get numberOfPositions() { return this.#numberOfPositions; }

  /**
   * Get the deadline for submitting applications.
   * @returns {?Timestamp} The application deadline, or null if not set
   */
  get applicationDeadline() { return this.#applicationDeadline; }

  /**
   * Get the detailed description of the contract position.
   * @returns {string} The job description
   */
  get description() { return this.#description; }

  /**
   * Get the key responsibilities for the role.
   * @returns {string} The responsibilities
   */
  get responsibilities() { return this.#responsibilities; }

  /**
   * Get the specific requirements for the position.
   * @returns {string} The requirements
   */
  get requirements() { return this.#requirements; }

  /**
   * Get the required experience level for the position.
   * @returns {string} The experience level
   */
  get experienceLevel() { return this.#experienceLevel; }

  /**
   * Get the array of required skills for the position.
   * Returns a deep copy for non-creators to prevent unauthorized modifications.
   * @returns {string[]} Array of required skills
   */
  get skills() { return (this.createdByCurrentUser() ? this.#skills : structuredClone(this.#skills)); }

  /**
   * Get the compensation rate.
   * @returns {string} The rate (e.g., "$75/hour", "$5000/month")
   */
  get rate() { return this.#rate; }

  /**
   * Get the expected or actual start date for the contract.
   * @returns {?Timestamp} The start date, or null if not set
   */
  get startDate() { return this.#startDate; }

  /**
   * Get the duration of the contract.
   * @returns {string} The duration (e.g., "6 months", "1 year")
   */
  get duration() { return this.#duration; }

  /**
   * Get the timestamp when the contract was soft-deleted.
   * @returns {?Timestamp} The deletion timestamp, or null if active
   */
  get deletedOn() { return this.#deletedOn; }

  /**
   * Get the array of user IDs who have applied to this contract.
   * Only accessible to the contract creator for privacy.
   * @returns {?string[]} Array of applicant user IDs, or null if not the creator
   */
  get applicants() { return (this.createdByCurrentUser() ? this.#applicants : null); }

  /**
   * Get the number of times this contract posting has been viewed.
   * @returns {number} The view count
   */
  get viewCount() { return this.#viewCount; }

  // Setters with validation

  /**
   * Set the job title or position name.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new title (will be trimmed)
   * @throws {Error} If not the contract creator
   * @throws {Error} If the trimmed value is not a non-empty string
   */
  set title(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Title must be a non-empty string");
    }

    this.#title = value.trim();
  }

  /**
   * Set the name of the entity offering the contract.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new entity name
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a string
   */
  set entityName(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "string") {
      throw new Error("Entity name must be a string");
    }

    this.#entityName = value;
  }

  /**
   * Set the current application status of the contract.
   *
   * Only the contract creator can modify this field.
   * @see contractApplicationStatusList
   * @param {string} value - The new application status (must be from contractApplicationStatusList)
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a valid application status
   */
  set applicationStatus(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (!contractApplicationStatusList.includes(value)) {
      throw new Error(`Application status must be one of:  ${contractApplicationStatusList.join(", ")}`);
    }

    this.#applicationStatus = value;
  }

  /**
   * Set the type of contract being offered.
   *
   * Only the contract creator can modify this field.
   * @see contractTypesList
   * @param {string} value - The new contract type (must be from contractTypesList)
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a valid contract type
   */
  set contractType(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (!contractTypesList.includes(value)) {
      throw new Error(`Contract type must be one of:  ${contractTypesList.join(", ")}`);
    }

    this.#contractType = value;
  }

  /**
   * Set the geographical location of the work.
   *
   * Only the contract creator can modify this field.
   * @param {?Location} value - The new location instance, or null for not applicable
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a Location instance or null
   */
  set location(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (value && !(value instanceof Location)) {
      throw new Error("Location must be a Location instance");
    }

    this.#location = value;
  }

  /**
   * Set whether a hybrid (remote and on-site) work location arrangement is available.
   *
   * Only the contract creator can modify this field.
   * @param {boolean} value - True if hybrid work location is an option, false otherwise
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a boolean
   */
  set worksite_hybrid(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_hybrid = value;
  }

  /**
   * Set whether an on-site work location arrangement is available.
   *
   * Only the contract creator can modify this field.
   * @param {boolean} value - True if on-site work is an option, false otherwise
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a boolean
   */
  set worksite_onSite(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_onSite = value;
  }

  /**
   * Set whether a remote work location arrangement is available.
   *
   * Only the contract creator can modify this field.
   * @param {boolean} value - True if remote work is an option, false otherwise
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a boolean
   */
  set worksite_remote(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    this.#worksite_remote = value;
  }

  /**
   * Set additional details about work location or arrangement.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new worksite details
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a string
   */
  set worksiteDetails(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "string") {
      throw new Error("Worksite details must be a string");
    }

    this.#worksiteDetails = value;
  }

  /**
   * Set the number of positions available for this contract.  A value of "0" means that
   * there's an indeterminate number of positions.
   *
   * Only the contract creator can modify this field.
   * @param {number} value - The number of positions (must be a positive integer)
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a positive integer
   */
  set numberOfPositions(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (!Number.isInteger(value) || value <= 0) {
      throw new Error("Number of positions must be a positive integer");
    }

    this.#numberOfPositions = value;
  }

  /**
   * Set the deadline for submitting applications.  The deadline, if not null, must be in the
   * future.
   *
   * Only the contract creator can modify this field.
   * @param {Timestamp} value - The application deadline, or null if there is no deadline
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a valid timestamp
   * @throws {Error} If the deadline is in the past
   */
  set applicationDeadline(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if ((value !== null) && (!isValidTimestamp(value))) {
      throw new Error("Application deadline must be either null or a valid timestamp");
    }

    const deadline = enforceTimestamp(value);

    if ((deadline !== null) && (deadline.toDate() <= Date.now())) {
      throw new Error("Application deadline must be in the future");
    }

    this.#applicationDeadline = deadline;
  }

  /**
   * Set the detailed description of the contract position.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new description (will be trimmed)
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a non-empty string
   */
  set description(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Description must be a non-empty string");
    }

    this.#description = value.trim();
  }

  /**
   * Set the key responsibilities for the role.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new responsibilities
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a string
   */
  set responsibilities(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "string") {
      throw new Error("Responsibilities must be a string");
    }

    this.#responsibilities = value;
  }

  /**
   * Set the specific requirements for the position.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new requirements
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a string
   */
  set requirements(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "string") {
      throw new Error("Requirements must be a string");
    }

    this.#requirements = value;
  }

  /**
   * Set the required experience level for the position.
   *
   * Only the contract creator can modify this field.
   * @see contractExperienceLevelsList
   * @param {string} value - The new experience level (must be from contractExperienceLevelsList)
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a valid experience level
   */
  set experienceLevel(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (!contractExperienceLevelsList.includes(value)) {
      throw new Error(`Experience level must be one of:  ${contractExperienceLevelsList.join(", ")}`);
    }

    this.#experienceLevel = value;
  }

  /**
   * Set the array of required skills for the position.  Duplicate skills and strings that are
   * empty after being trimmed will be automatically removed.
   *
   * Only the contract creator can modify this field.
   * @param {string[]} value - Array of skill names (will be trimmed, duplicates removed)
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not an array of non-empty strings
   */
  set skills(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (!Array.isArray(value) || value.some((skill) => enforceTrimmedString(skill) === "")) {
      throw new Error("Skills must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#skills = [...new Set(value.map((skill) => skill.trim()))]; // Remove duplicates using Set
  }


  /**
   * Set the compensation rate for the position.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The new rate (e.g., "$75/hour", "$5000/month")
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a string
   */
  set rate(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "string") {
      throw new Error("Rate must be a string");
    }

    this.#rate = value;
  }

  /**
   * Set the expected or actual start date for the contract.
   *
   * Only the contract creator can modify this field.
   * @param {?Timestamp} value - The start date timestamp, or null if undetermined
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a valid timestamp or null
   */
  set startDate(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if ((value !== null) && !isValidTimestamp(value)) {
      throw new Error("Start date must be a valid timestamp");
    }

    this.#startDate = enforceTimestamp(value);
  }

  /**
   * Set the duration of the contract.
   *
   * Only the contract creator can modify this field.
   * @param {string} value - The duration (e.g., "6 months", "1 year")
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not a string
   */
  set duration(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (typeof value !== "string") {
      throw new Error("Duration must be a string");
    }

    this.#duration = value;
  }

  /**
   * Set the array of user IDs who have applied to this contract.  Duplicate user IDs will be
   * removed automatically.
   *
   * Only the contract creator can modify this field.
   * @param {string[]} value - Array of Firebase user UIDs
   * @throws {Error} If not the contract creator
   * @throws {Error} If value is not an array of valid Firebase user UIDs
   */
  set applicants(value) {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can modify this property")
    }

    if (!Array.isArray(value) || value.some((applicant) => !isValidFirebaseUserUID(applicant))) {
      throw new Error("Value must be an array of Firebase user UID's (duplicates will be discarded)");
    }

    this.#applicants = [...new Set(value)]; // Remove duplicates using Set
  }

  // Methods

  /**
   * Get an array of the contract's worksite options as human-readable strings.
   *
   * @returns {string[]} Array of worksite options strings (e.g., ["On-Site", "Remote", "Hybrid"])
   */
  worksiteOptionsToStrings() {
    const options = [];

    if (this.#worksite_onSite) options.push(Contract.WORKSITE_TEXTS.onSite);
    if (this.#worksite_remote) options.push(Contract.WORKSITE_TEXTS.remote);
    if (this.#worksite_hybrid) options.push(Contract.WORKSITE_TEXTS.hybrid);

    return options;
  }

  /**
   * Check if this contract is currently active (not soft-deleted).
   * @returns {boolean} True if the contract is active, false if deleted
   */
  isActive() {
    return (this.#deletedOn === null);
  }

  /**
   * Soft-delete this contract by setting the deletedOn timestamp.
   *
   * Only the contract's creator can delete a contract.
   * @throws {Error} If the current user is not the contract creator
   */
  delete() {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can perform this action")
    }

    this.#deletedOn = serverTimestamp();
  }

  /**
   * Undelete this contract by nullifying the deletedOn timestamp.
   *
   * Only the contract's creator can delete a contract.
   * @throws {Error} If the current user is not the contract creator
   */
  undelete() {
    if (!this.createdByCurrentUser()) {
      throw new Error("Only the contract creator can perform this action")
    }

    this.#deletedOn = null;
  }

  /**
   * Check if the application deadline has passed.
   * @returns {boolean} True if deadline has passed, false if otherwise
   */
  isExpired() {
    return (this.#applicationDeadline === null ? false : this.#applicationDeadline.toDate() < Date.now());
  }

  /**
   * Apply to this contract as the current user.
   * Adds the current user's ID to the applicants array if not already present.
   * @throws {Error} If current user is not set
   */
  apply() {
    const userId = Contract.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Contract.setCurrentUser() first.");
    }

    if (!this.#applicants.includes(userId)) {
      this.#applicants.push(userId);
    }
  }

  /**
   * Check if the current user has applied to this contract.
   * @returns {boolean} True if the current user has applied, false otherwise
   * @throws {Error} If current user is not set
   */
  hasApplied() {
    const userId = Contract.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Contract.setCurrentUser() first.");
    }

    return this.#applicants.includes(userId);
  }

  /**
   * Withdraw the current user's application from this contract.
   * Removes the current user's ID from the applicants array.
   * @throws {Error} If current user is not set
   */
  withdrawApplication() {
    const userId = Contract.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Contract.setCurrentUser() first.");
    }

    this.#applicants = this.#applicants.filter((applicant) => applicant !== userId);
  }

  /**
   * Increment the view count for this contract by one.
   * Typically called whenever a user views the contract details.
   */
  incrementViewCount() {
    ++this.#viewCount;
  }

  /**
   * Convert this contract to a plain JavaScript object suitable for Firebase Firestore.
   *
   * This method prepares the contract data for storage in Firestore, including all
   * necessary metadata and arrays. The postedOn timestamp is only included if it's not
   * already set (i.e., when creating a new document).
   *
   * @returns {Object} Plain object representation of the contract for Firestore
   * @example
   * // Save contract to Firestore
   *
   * const contractData = contract.toFirebaseDocument();
   * await setDoc(doc(db, "contracts", contractId), contractData);
   */
  toFirebaseDocument() {
    const doc = {
      title:  this.#title,
      entityName:  this.#entityName,
      postedBy:  this.#postedBy,
      applicationStatus:  this.#applicationStatus,
      contractType:  this.#contractType,
      location:  this.#location?.toFirebaseDocument(),
      worksite_hybrid:  this.#worksite_hybrid,
      worksite_onSite:  this.#worksite_onSite,
      worksite_remote:  this.#worksite_remote,
      worksiteDetails:  this.#worksiteDetails,
      numberOfPositions:  this.#numberOfPositions,
      applicationDeadline:  this.#applicationDeadline,
      description:  this.#description,
      responsibilities:  this.#responsibilities,
      requirements:  this.#requirements,
      experienceLevel:  this.#experienceLevel,
      skills:  this.#skills.map((skill) => enforceTrimmedString(skill)).filter((skill) => skill !== ""),
      rate:  this.#rate,
      startDate:  this.#startDate,
      duration:  this.#duration,
      deletedOn:  this.#deletedOn,
      applicants:  this.#applicants.filter((applicant) => isValidFirebaseUserUID(applicant)),
      viewCount:  this.#viewCount
    };

    // Only set postedOn if we're creating a new document

    if (!this.#postedOn) {
      doc.postedOn = serverTimestamp();
    }

    return doc;
  }

  /**
   * Firebase Firestore converter for automatic conversion between Contract instances and Firestore documents.
   *
   * This converter enables direct use of Contract instances with Firestore operations:
   * - `doc.withConverter(Contract.firebaseConverter)` for reading/writing documents
   * - Automatic conversion from Firestore documents to Contract instances
   * - Automatic conversion from Contract instances to Firestore documents
   *
   * @example
   * // Reading a contract from Firestore
   *
   * const contractRef = doc(db, "contracts", contractId).withConverter(Contract.firebaseConverter);
   * const contractSnap = await getDoc(contractRef);
   * const contract = contractSnap.data();  // Returns Contract instance
   *
   * // Writing a contract to Firestore
   *
   * await setDoc(contractRef, contract);  // Automatically converted to plain object
   */
  static firebaseConverter = {
    fromFirestore:  (snapshot, options) => new Contract(snapshot.data(options)),
    toFirestore:  (contract) => contract.toFirebaseDocument()
  };

  /**
   * Checks if the current user is the creator of this contract.
   *
   * @returns {boolean} True if the current user matches the postedBy field, false otherwise
   */
  createdByCurrentUser() {
    return Contract.#currentUserId === this.#postedBy;
  }
}

export default Contract;