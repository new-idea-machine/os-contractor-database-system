import { serverTimestamp } from "firebase/firestore";
import {
  isValidTimestamp,
  enforceTimestamp,
  isValidFirebaseUserUID,
  parseStringsArray,
  contractApplicationStatusList,
  contractExperienceLevelsList,
  contractTypesList } from "../constants/data";
import { Location } from "./Location";

/**
 * @fileoverview Contract data model for managing job postings and contract opportunities.
 *
 * This model represents contract information that recruiters can post for contractors to view
 * and apply to. It includes comprehensive information about the position, requirements,
 * compensation, and work arrangements.
 */

/**
 * Contract model for storing job posting and contract opportunity information.
 *
 * Manages comprehensive contract data including posting details, job requirements, location,
 * compensation, skills needed, and applicant tracking.  Supports soft deletion and status
 * tracking throughout the hiring lifecycle.
 *
 * @class Contract
 */
class Contract {
  // Private members

  /**
   * Job title or position name
   * @private
   * @type {string}
   */
  #title = "";

  /**
   * Name of the company offering the contract
   * @private
   * @type {string}
   */
  #companyName = "";

  /**
   * User ID of the recruiter who posted this contract
   * @private
   * @type {string}
   */
  #postedBy = "";

  /**
   * Timestamp when the contract was posted
   * @private
   * @type {?Timestamp}
   */
  #postedOn = null;

  /**
   * Type of contract being offered (must be one of the "contractTypesList" constants)
   * @private
   * @type {string}
   */
  #contractType = contractTypesList[0];

  /**
   * Current status of the contract posting (must be one of the "contractApplicationStatusList"
   * constants)
   * @private
   * @type {string}
   */
  #applicationStatus = contractApplicationStatusList[0];

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
   * Geographical location of the work
   * @private
   * @type {?Location}
   */
  #location = null;

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
   * Number of times this contract posting has been viewed
   * @private
   * @type {number}
   */
  #viewCount = 0;

  // Constructor

  /**
   * Create a new Contract instance.
   *
   * @constructor
   * @param {Object} [data={}] - Contract data object
   * @param {string} [data.title] - Job title
   * @param {string} [data.companyName] - Company name
   * @param {string} [data.postedBy] - User ID of the recruiter who posted this contract
   * @param {Timestamp} [data.postedOn] - Posting timestamp
   * @param {string} [data.contractType] - Type of contract
   * @param {string} [data.applicationStatus] - Contract application status
   * @param {number} [data.numberOfPositions] - Number of positions available
   * @param {Timestamp} [data.applicationDeadline] - Application deadline
   * @param {string} [data.description] - Job description
   * @param {string} [data.responsibilities] - Role responsibilities
   * @param {string} [data.requirements] - Position requirements
   * @param {string} [data.experienceLevel] - Required experience level
   * @param {string[]} [data.skills] - Required skills
   * @param {string} [data.rate] - Compensation rate (e.g., "$75/hour")
   * @param {Location|Object} [data.location] - Location instance or location data
   * @param {Timestamp} [data.startDate] - Expected or actual start date
   * @param {string} [data.duration] - Contract duration (e.g., "6 months")
   * @param {Timestamp} [data.deletedOn] - Soft delete timestamp
   * @param {string[]} [data.applicants] - Array of applicant user IDs
   * @param {boolean} [data.worksite_hybrid] - Hybrid work required
   * @param {boolean} [data.worksite_onSite] - On-site work required
   * @param {boolean} [data.worksite_remote] - Remote work required
   * @param {string} [data.worksiteDetails] - Additional worksite details
   * @param {number} [data.viewCount] - View count
   */
  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      this.#title = (typeof data.title === "string" ? data.title : this.#title);
      this.#companyName = (typeof data.companyName === "string" ? data.companyName : this.#companyName);
      this.#postedBy = (isValidFirebaseUserUID(data.postedBy) ? data.postedBy : this.#postedBy);
      this.#postedOn = enforceTimestamp(data.postedOn);
      this.#contractType = (contractTypesList.includes(data.contractType) ? data.contractType : this.#contractType);
      this.#applicationStatus = (contractApplicationStatusList.includes(data.applicationStatus) ? data.status : this.#applicationStatus);
      this.#numberOfPositions = (typeof data.numberOfPositions === "number" ? parseInt(data.numberOfPositions) : this.#numberOfPositions);
      this.#applicationDeadline = enforceTimestamp(data.applicationDeadline);
      this.#description = (typeof data.description === "string" ? data.description : this.#description);
      this.#responsibilities = (typeof data.responsibilities === "string" ? data.responsibilities : this.#responsibilities);
      this.#requirements = (typeof data.requirements === "string" ? data.requirements : this.#requirements);
      this.#experienceLevel = (contractExperienceLevelsList.includes(data.experienceLevel) ? data.experienceLevel : this.#experienceLevel);

      parseStringsArray(data.skills, this.#skills);

      this.#rate = (typeof data.rate === "string" ? data.rate : this.#rate);
      this.#location = data?.location instanceof Location ? data.location : new Location(data?.location);
      this.#startDate = enforceTimestamp(data.startDate);
      this.#duration = (typeof data.duration === "string" ? data.duration : this.#duration);
      this.#deletedOn = enforceTimestamp(data.deletedOn);

      if (Array.isArray(data.applicants)) {
        parseStringsArray(data.applicants.filter((applicant) => isValidFirebaseUserUID(applicant)), this.#applicants);
      }

      this.#worksite_hybrid = (typeof data.worksite_hybrid === "boolean" ? data.worksite_hybrid : this.#worksite_hybrid);
      this.#worksite_onSite = (typeof data.worksite_onSite === "boolean" ? data.worksite_onSite : this.#worksite_onSite);
      this.#worksite_remote = (typeof data.worksite_remote === "boolean" ? data.worksite_remote : this.#worksite_remote);
      this.#worksiteDetails = (typeof data.worksiteDetails === "string" ? data.worksiteDetails : this.#worksiteDetails);
      this.#viewCount = (typeof data.viewCount === "number" ? parseInt(data.viewCount) : this.#viewCount);
    }
  }

  // Getters
  get title() { return this.#title; }
  get companyName() { return this.#companyName; }
  get postedBy() { return this.#postedBy; }
  get postedOn() { return this.#postedOn; }
  get contractType() { return this.#contractType; }
  get applicationStatus() { return this.#applicationStatus; }
  get numberOfPositions() { return this.#numberOfPositions; }
  get applicationDeadline() { return this.#applicationDeadline; }
  get description() { return this.#description; }
  get responsibilities() { return this.#responsibilities; }
  get requirements() { return this.#requirements; }
  get experienceLevel() { return this.#experienceLevel; }
  get skills() { return this.#skills; }
  get rate() { return this.#rate; }
  get location() { return this.#location; }
  get startDate() { return this.#startDate; }
  get duration() { return this.#duration; }
  get deletedOn() { return this.#deletedOn; }
  get applicants() { return this.#applicants; }
  get worksiteDetails() { return this.#worksiteDetails; }
  get viewCount() { return this.#viewCount; }

  // Setters with validation
  set title(value) {
    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Title must be a non-empty string");
    }

    this.#title = value.trim();
  }

  set companyName(value) {
    if (typeof value !== "string") {
      throw new Error("Company name must be a string");
    }

    this.#companyName = value;
  }

  set postedBy(value) {
    if (!isValidFirebaseUserUID(value)) {
      throw new Error("Value must be a valid Firebase user UID");
    }

    this.#postedBy = value;
  }

  set postedOn(value) {
    if ((value !== null) && !isValidTimestamp(value)) {
      throw new Error("Posted-on must be a valid timestamp");
    }

    this.#postedOn = enforceTimestamp(value);
  }

  set contractType(value) {
    if (!contractTypesList.includes(value)) {
      throw new Error(`Contract type must be one of:  ${contractTypesList.join(", ")}`);
    }

    this.#contractType = value;
  }

  set applicationStatus(value) {
    if (!contractApplicationStatusList.includes(value)) {
      throw new Error(`Application status must be one of:  ${contractApplicationStatusList.join(", ")}`);
    }

    this.#applicationStatus = value;
  }

  set numberOfPositions(value) {
    if (typeof value !== "number" || value <= 0) {
      throw new Error("Number of positions must be a positive number");
    }

    this.#numberOfPositions = value;
  }

  set applicationDeadline(value) {
    if ((value !== null) && !isValidTimestamp(value)) {
      throw new Error("Application deadline must be a valid timestamp");
    }

    this.#applicationDeadline = enforceTimestamp(value);
  }

  set description(value) {
    if ((typeof value !== "string") || (value.trim() === "")) {
      throw new Error("Description must be a non-empty string");
    }

    this.#description = value.trim();
  }

  set responsibilities(value) {
    if (typeof value !== "string") {
      throw new Error("Responsibilities must be a string");
    }

    this.#responsibilities = value;
  }

  set requirements(value) {
    if (typeof value !== "string") {
      throw new Error("Requirements must be a string");
    }

    this.#requirements = value;
  }

  set experienceLevel(value) {
    if (!contractExperienceLevelsList.includes(value)) {
      throw new Error(`Experience level must be one of:  ${contractExperienceLevelsList.join(", ")}`);
    }

    this.#experienceLevel = value;
  }

  set skills(value) {
    if (!Array.isArray(value) || value.some((skill) => (typeof skill !== "string") || (skill.trim() === ""))) {
      throw new Error("Skills must be an array of non-empty strings (duplicates will be discarded)");
    }

    this.#skills = [...new Set(value.map((skill) => skill.trim()))]; // Remove duplicates using Set
  }

  set rate(value) {
    if (typeof value !== "string") {
      throw new Error("Rate must be a string");
    }

    this.#rate = value;
  }

  set location(value) {
    if (value && !(value instanceof Location)) {
      throw new Error("Location must be a Location object");
    }

    this.#location = value;
  }

  set startDate(value) {
    if ((value !== null) && !isValidTimestamp(value)) {
      throw new Error("Start date must be a valid timestamp");
    }

    this.#startDate = enforceTimestamp(value);
  }

  set duration(value) {
    if (typeof value !== "string") {
      throw new Error("Duration must be a string");
    }

    this.#duration = value;
  }

  set deletedOn(value) {
    if ((value !== null) && !isValidTimestamp(value)) {
      throw new Error("Deleted-on must be a valid timestamp");
    }

    this.#deletedOn = enforceTimestamp(value);
  }

  set applicants(value) {
    if (!Array.isArray(value) || value.some((applicant) => !isValidFirebaseUserUID(applicant))) {
      throw new Error("Applicants must be an array of Firebase user UID's (duplicates will be discarded)");
    }

    this.#applicants = [...new Set(value.map((applicant) => applicant.trim()))]; // Remove duplicates using Set
  }

  set worksiteDetails(value) {
    if (typeof value !== "string") {
      throw new Error("Worksite details must be a string");
    }

    this.#worksiteDetails = value;
  }

  set viewCount(value) {
    if (typeof value !== "number" || value < 0) {
      throw new Error("View count must be a positive number");
    }

    this.#viewCount = Math.round(value);
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
      title:  this.#title,
      companyName:  this.#companyName,
      postedBy:  this.#postedBy,
      postedOn:  this.#postedOn,
      contractType:  this.#contractType,
      applicationStatus:  this.#applicationStatus,
      numberOfPositions:  this.#numberOfPositions,
      applicationDeadline:  this.#applicationDeadline,
      description:  this.#description,
      responsibilities:  this.#responsibilities,
      requirements:  this.#requirements,
      experienceLevel:  this.#experienceLevel,
      skills:  this.#skills,
      rate:  this.#rate,
      location:  this.#location,
      startDate:  this.#startDate,
      duration:  this.#duration,
      deletedOn:  this.#deletedOn,
      applicants:  this.#applicants,
      worksite_hybrid:  this.#worksite_hybrid,
      worksite_onSite:  this.#worksite_onSite,
      worksite_remote:  this.#worksite_remote,
      worksiteDetails:  this.#worksiteDetails,
      viewCount:  this.#viewCount
    };
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    const data = doc?.data();

    return data ? new Contract(data) : null;
  }
}

export default Contract;