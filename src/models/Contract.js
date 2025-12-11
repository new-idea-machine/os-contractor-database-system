import { serverTimestamp } from "firebase/firestore";
import { enforceTimestamp, isValidFirebaseUserUID, parseStringsArray } from "../constants/data";
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
  // Application status constants

  /**
   * Application status:  Open for applications
   * @static
   * @constant {string}
   */
  static APPLICATION_STATUS_OPEN = "Open";

  /**
   * Application status:  Applications under review
   * @static
   * @constant {string}
   */
  static APPLICATION_STATUS_IN_REVIEW = "In Review";

  /**
   * Application status:  Position has been filled
   * @static
   * @constant {string}
   */
  static APPLICATION_STATUS_FILLED = "Filled";

  /**
   * Application status:  Posting is closed
   * @static
   * @constant {string}
   */
  static APPLICATION_STATUS_CLOSED = "Closed";

  /**
   * Array of valid contract status values
   * @static
   * @constant {string[]}
   */
  static VALID_APPLICATION_STATUSES = [
    Contract.APPLICATION_STATUS_OPEN,
    Contract.APPLICATION_STATUS_IN_REVIEW,
    Contract.APPLICATION_STATUS_FILLED,
    Contract.APPLICATION_STATUS_CLOSED
  ];

  // Experience level constants

  /**
   * Experience level:  Junior
   * @static
   * @constant {string}
   */
  static EXPERIENCE_JUNIOR = "Junior";

  /**
   * Experience level:  Intermediate
   * @static
   * @constant {string}
   */
  static EXPERIENCE_MID = "Intermediate";

  /**
   * Experience level:  Senior
   * @static
   * @constant {string}
   */
  static EXPERIENCE_SENIOR = "Senior";

  /**
   * Experience level: Lead
   * @static
   * @constant {string}
   */
  static EXPERIENCE_LEAD = "Lead";

  /**
   * Array of valid experience level values
   * @static
   * @constant {string[]}
   */
  static VALID_EXPERIENCE_LEVELS = [
    Contract.EXPERIENCE_JUNIOR,
    Contract.EXPERIENCE_MID,
    Contract.EXPERIENCE_SENIOR,
    Contract.EXPERIENCE_LEAD
  ];

  // Contract type constants

  /**
   * Contract type:  Fixed-term
   * @static
   * @constant {string}
   */
  static TYPE_FIXED_TERM = "Fixed-term";

  /**
   * Contract type:  Ongoing
   * @static
   * @constant {string}
   */
  static TYPE_ONGOING = "Ongoing";

  /**
   * Contract type:  Project-based
   * @static
   * @constant {string}
   */
  static TYPE_PROJECT_BASED = "Project-based";

  /**
   * Array of valid contract type values
   * @static
   * @constant {string[]}
   */
  static VALID_CONTRACT_TYPES = [
    Contract.TYPE_FIXED_TERM,
    Contract.TYPE_ONGOING,
    Contract.TYPE_PROJECT_BASED
  ];

  // Private members

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
   * Timestamp when the contract was soft-deleted (null if active)
   * @private
   * @type {?Timestamp}
   */
  #deletedOn = null;

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
   * Job title or position name
   * @private
   * @type {string}
   */
  #title = "";

  /**
   * Detailed description of the contract position
   * @private
   * @type {string}
   */
  #description = "";

  /**
   * Array of required skills for the position
   * @private
   * @type {string[]}
   */
  #skills = [];

  /**
   * Geographical location of the work
   * @private
   * @type {?Location}
   */
  #location = null;

  /**
   * Compensation rate (e.g., "$75/hour", "$5000/month")
   * @private
   * @type {string}
   */
  #rate = "";

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
   * Name of the company offering the contract
   * @private
   * @type {string}
   */
  #companyName = "";

  /**
   * Required experience level for the position (must be one of the "experience" constants)
   * @private
   * @type {string}
   */
  #experienceLevel = this.EXPERIENCE_JUNIOR;

  /**
   * Current status of the contract posting (must be one of the "contract status" constants)
   * @private
   * @type {string}
   */
  #status = this.STATUS_OPEN;

  /**
   * Type of contract being offered (must be one of the "contract type" constants)
   * @private
   * @type {string}
   */
  #contractType = this.TYPE_ONGOING;

  /**
   * Deadline for submitting applications
   * @private
   * @type {?Timestamp}
   */
  #applicationDeadline = null;

  /**
   * Number of positions available for this contract
   * @private
   * @type {number}
   */
  #numberOfPositions = 1;

  /**
   * Array of specific requirements for the position
   * @private
   * @type {string}
   */
  #requirements = "";

  /**
   * Array of key responsibilities for the role
   * @private
   * @type {string}
   */
  #responsibilities = "";

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
   * @param {string} [data.postedBy] - User ID of the recruiter who posted this contract
   * @param {Timestamp} [data.postedOn] - Posting timestamp
   * @param {Timestamp} [data.deletedOn] - Soft delete timestamp
   * @param {Timestamp} [data.startDate] - Expected or actual start date
   * @param {string} [data.duration] - Contract duration (e.g., "6 months")
   * @param {string} [data.title] - Job title
   * @param {string} [data.description] - Job description
   * @param {string[]} [data.skills] - Required skills
   * @param {Location|Object} [data.location] - Location instance or location data
   * @param {string} [data.rate] - Compensation rate (e.g., "$75/hour")
   * @param {string[]} [data.applicants] - Array of applicant user IDs
   * @param {boolean} [data.worksite_hybrid] - Hybrid work required
   * @param {boolean} [data.worksite_onSite] - On-site work required
   * @param {boolean} [data.worksite_remote] - Remote work required
   * @param {string} [data.companyName] - Company name
   * @param {string} [data.experienceLevel] - Required experience level
   * @param {string} [data.status] - Contract status
   * @param {string} [data.contractType] - Type of contract
   * @param {Timestamp} [data.applicationDeadline] - Application deadline
   * @param {number} [data.numberOfPositions] - Number of positions available
   * @param {string} [data.requirements] - Position requirements
   * @param {string} [data.responsibilities] - Role responsibilities
   * @param {string} [data.worksiteDetails] - Additional worksite details
   * @param {number} [data.viewCount] - View count
   */
  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      this.#postedBy = (isValidFirebaseUserUID(data.postedBy) ? data.postedBy : this.#postedBy);
      this.#postedOn = enforceTimestamp(data.postedOn);
      this.#deletedOn = enforceTimestamp(data.deletedOn);
      this.#startDate = enforceTimestamp(data.startDate);
      this.#duration = (typeof data.duration === "string" ? data.duration : this.#duration);
      this.#title = (typeof data.title === "string" ? data.title : this.#title);
      this.#description = (typeof data.description === "string" ? data.description : this.#description);

      parseStringsArray(data.skills, this.#skills);

      this.#location = data?.location instanceof Location ? data.location : new Location(data?.location);
      this.#rate = (typeof data.rate === "string" ? data.rate : this.#rate);

      if (Array.isArray(data.applicants)) {
        parseStringsArray(data.applicants.filter((applicant) => isValidFirebaseUserUID(applicant)), this.#applicants);
      }

      this.#worksite_hybrid = (typeof data.worksite_hybrid === "boolean" ? data.worksite_hybrid : this.#worksite_hybrid);
      this.#worksite_onSite = (typeof data.worksite_onSite === "boolean" ? data.worksite_onSite : this.#worksite_onSite);
      this.#worksite_remote = (typeof data.worksite_remote === "boolean" ? data.worksite_remote : this.#worksite_remote);

      this.#companyName = (typeof data.companyName === "string" ? data.companyName : this.#companyName);
      this.#experienceLevel = (typeof data.experienceLevel === "string" ? data.experienceLevel : this.#experienceLevel);
      this.#status = (typeof data.status === "string" ? data.status : this.#status);
      this.#contractType = (typeof data.contractType === "string" ? data.contractType : this.#contractType);
      this.#applicationDeadline = enforceTimestamp(data.applicationDeadline);
      this.#numberOfPositions = (typeof data.numberOfPositions === "number" ? parseInt(data.numberOfPositions) : this.#numberOfPositions);
      this.#requirements = (typeof data.requirements === "string" ? data.requirements : this.#requirements);
      this.#responsibilities = (typeof data.responsibilities === "string" ? data.responsibilities : this.#responsibilities);
      this.#worksiteDetails = (typeof data.worksiteDetails === "string" ? data.worksiteDetails : this.#worksiteDetails);
      this.#viewCount = (typeof data.viewCount === "number" ? parseInt(data.viewCount) : this.#viewCount);
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
  get companyName() { return this.#companyName; }
  get experienceLevel() { return this.#experienceLevel; }
  get status() { return this.#status; }
  get contractType() { return this.#contractType; }
  get applicationDeadline() { return this.#applicationDeadline; }
  get numberOfPositions() { return this.#numberOfPositions; }
  get requirements() { return this.#requirements; }
  get responsibilities() { return this.#responsibilities; }
  get worksiteDetails() { return this.#worksiteDetails; }
  get viewCount() { return this.#viewCount; }

  // Setters with validation
  set postedBy(value) {
    if (!isValidFirebaseUserUID(value)) {
      throw new Error("Value must be a valid Firebase user UID");
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
    if (typeof value !== "string") {
      throw new Error("Duration must be a string");
    }
    this.#duration = value;
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
    if (value && !(value instanceof Location)) {
      throw new Error("Value must be a Location object");
    }

    this.#location = value;
  }

  set rate(value) {
    if (typeof value !== "string") {
      throw new Error("Rate must be a string");
    }

    this.#rate = value;
  }

  set applicants(value) {
    if (!Array.isArray(value) || value.some((applicant) => !isValidFirebaseUserUID(applicant))) {
      throw new Error("Value must be an array of Firebase user UID's (duplicates will be discarded)");
    }

    this.#applicants = [...new Set(value.map((applicant) => applicant.trim()))]; // Remove duplicates using Set
  }

  set companyName(value) {
    if (typeof value !== "string") {
      throw new Error("Company name must be a string");
    }
    this.#companyName = value;
  }

  set experienceLevel(value) {
    if (typeof value !== "string") {
      throw new Error("Experience level must be a string");
    }
    this.#experienceLevel = value;
  }

  set status(value) {
    if (!Contract.VALID_APPLICATION_STATUSES.includes(value)) {
      throw new Error(`Status must be one of: ${Contract.VALID_APPLICATION_STATUSES.join(", ")}`);
    }
    this.#status = value;
  }

  set contractType(value) {
    if (typeof value !== "string") {
      throw new Error("Contract type must be a string");
    }
    this.#contractType = value;
  }

  set applicationDeadline(value) {
    this.#applicationDeadline = enforceTimestamp(value);
  }

  set numberOfPositions(value) {
    if (typeof value !== "number" || value <= 0) {
      throw new Error("Number of positions must be a positive number");
    }
    this.#numberOfPositions = value;
  }

  set requirements(value) {
    if (typeof value !== "string") {
      throw new Error("Requirements must be a string");
    }
    this.#requirements = value;
  }

  set responsibilities(value) {
    if (typeof value !== "string") {
      throw new Error("Responsibilities must be a string");
    }
    this.#responsibilities = value;
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
      applicants:  this.#applicants,
      worksite_hybrid:  this.#worksite_hybrid,
      worksite_onSite:  this.#worksite_onSite,
      worksite_remote:  this.#worksite_remote,
      companyName:  this.#companyName,
      experienceLevel:  this.#experienceLevel,
      status:  this.#status,
      contractType:  this.#contractType,
      applicationDeadline:  this.#applicationDeadline,
      numberOfPositions:  this.#numberOfPositions,
      requirements:  this.#requirements,
      responsibilities:  this.#responsibilities,
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