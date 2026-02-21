/**
 * @fileoverview Project data model for managing portfolio projects.
 *
 * This module implements the Project class, providing functionality for storing and
 * managing project information in user portfolios within the contractor database system.
 * Each project includes a title, description, and URL, with automatic validation and
 * serialization for Firebase Firestore operations.
 *
 * Key features:
 * - Comprehensive project information storage (title, description, URL)
 * - Automatic validation for all properties
 * - Whitespace trimming for all string properties
 * - Firebase-compatible document serialization
 *
 * If multiple Project instances are used as the bases of a React components then each
 * project's title must be unique so that they can serve as a React component keys.
 *
 * @example
 * import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
 * import { db } from "../firebase";
 * import Project from "../models/Project";
 *
 * // Fetch a document from Firebase using automatic converter
 *
 * const projectRef = doc(db, "projects", projectId).withConverter(Project.firebaseConverter);
 * const projectSnap = await getDoc(projectRef);
 * const project = projectSnap.data();  // Already a Project instance
 *
 * // Access project data
 *
 * console.log(`Title: ${project.title}`);
 * console.log(`Description: ${project.description}`);
 * console.log(`URL: ${project.url}`);
 *
 * // Update project properties and save back to Firebase (automatic conversion to plain object)
 *
 * project.description = "Updated description with new features";
 * project.url = "https://github.com/user/ecommerce-v2";
 * await setDoc(projectRef, project);
 *
 * // Or update specific fields without converter
 *
 * const newProjectData = project.toFirebaseDocument();
 * newProjectData.url = "https://github.com/user/ecommerce-v3"
 * await updateDoc(doc(db, "projects", projectId), newProjectData);
 *
 * @module models/Project
 * @requires constants/data
 */

import { isValidURL, enforceTrimmedString } from "../constants/data";

/**
 * Project model for storing project data for a user's portfolio.
 *
 * This class encapsulates project information including title, description, and URL.
 * It provides validation for all properties and methods for Firestore serialization.
 *
 * @class Project
 * @example
 * const project = new Project({
 *   title: "E-commerce Platform",
 *   description: "A full-stack e-commerce solution with React and Node.js",
 *   url: "https://github.com/user/ecommerce"
 * });
 */
class Project {
  // Private members

  /**
   * A detailed description of the project
   * @private
   * @type {string}
   */
  #description = "";

  /**
   * The project's title (must be unique among the user's projects)
   * @private
   * @type {string}
   */
  #title;  // See constructor for default initial value

  /**
   * URL to the project (e.g., GitHub repository, live demo, documentation)
   * @private
   * @type {string}
   */
  #url = "";

  // Constructor

  /**
   * Create a new Project instance.
   *
   * @constructor
   * @param {Object} [data={}] - Project data object
   * @param {string} [data.description=""] - Project description
   * @param {string} [data.title=""] - Project title (must be unique)
   * @param {string} [data.url=""] - Project URL (e.g., GitHub repository, live demo)
   * @example
   * // Create a new project
   *
   * const project = new Project({
   *   title: "Portfolio Website",
   *   description: "Personal portfolio built with React",
   *   url: "https://myportfolio.com"
   * });
   */
  constructor(data = {}) {
    /*
    This constructor considers the possibility that data may be invalid or missing and will add
    default values to its members where necessary to maintain data integrity.
    */

    if (typeof data === "object" && !Array.isArray(data)) {
      const title = enforceTrimmedString(data.title);
      const url = enforceTrimmedString(data.url);

      this.#description = enforceTrimmedString(data.description);
      this.#title = (title !== "" ? title : (new Date(Date.now())).toLocaleString());
      this.#url = (isValidURL(url) ? url : this.#url);
    }
  }

  // Getters

  /**
   * Get the project description.
   *
   * @returns {string} Project description
   */
  get description() { return this.#description; }

  /**
   * Get the project title.
   *
   * @returns {string} Project title
   */
  get title() { return this.#title; }

  /**
   * Get the project URL.
   *
   * @returns {string} Project URL
   */
  get url() { return this.#url; }

  // Setters with validation

  /**
   * Set the project description.
   * Automatically trims whitespace from the value.
   *
   * @param {string} value - Project description
   * @throws {Error} If value is not a string
   */
  set description(value) {
    if (typeof value !== "string") {
      throw new Error("Value must be a string");
    }

    this.#description = value.trim();
  }

  /**
   * Set the project title.
   * Automatically trims whitespace from the value.
   *
   * @param {string} value - Project title (must be a unique, non-empty string)
   * @throws {Error} If value is not a non-empty string
   */
  set title(value) {
    const newValue = enforceTrimmedString(value);

    if (newValue === "") {
      throw new Error("Value must be a unique, non-empty string");
    }

    this.#title = newValue;
  }

  /**
   * Set the project URL.
   * Automatically trims whitespace from the value.
   *
   * @param {string} value - Project URL (must be a string)
   * @throws {Error} If value is not a valid URL
   */
  set url(value) {
    const newValue = enforceTrimmedString(value);

    if (!isValidURL(newValue)) {
      throw new Error("Value must be a valid uniform resource locator");
    }

    this.#url = newValue;
  }

  // Methods

  /**
   * Convert the Project instance to a plain object suitable for storing in Firebase.
   *
   * This method serializes all project data into a format that can be directly written to
   * Firebase or embedded in other documents.
   *
   * @returns {Object} Plain object representation of the project data
   */
  toFirebaseDocument() {
    return {
      description:  this.#description,
      title:  this.#title,
      url:  this.#url
    };
  }

  /**
   * Firestore converter for automatic serialization and deserialization of Project instances.
   *
   * Use this converter with Firestore document references to automatically convert between
   * Project instances and Firestore documents.  This is the recommended approach for Firestore
   * operations.
   *
   * @static
   * @type {Object}
   * @property {Function} fromFirestore - Converts Firestore document to Project instance
   * @property {Function} toFirestore - Converts Project instance to Firestore document
   * @example
   * const projectRef = doc(db, "projects", projectId).withConverter(Project.firebaseConverter);
   *
   * // Reading returns a Project instance
   *
   * const projectSnap = await getDoc(projectRef);
   * const project = projectSnap.data();  // Returns Project instance
   *
   * // Writing accepts a Project instance
   *
   * const newProject = new Project({
   *   title:  "Runway",
   *   description:  "A dynamic runway design system for aircraft and fashion models",
   *   url:  "https://runway.dev"
   * });
   * await setDoc(projectRef, newProject);
   */
  static firebaseConverter = {
    fromFirestore:  (snapshot, options) => new Project(snapshot.data(options)),
    toFirestore:  (project) => project.toFirebaseDocument()
  };
}

export default Project;
