class Project {
  // Private fields
  #description = "";
  #title = "";
  #url = "";

  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {

      // Initialize from data or use defaults
      this.#description = data.description || this.#description;
      this.#title = data.title || this.#title;
      this.#url = data.url || this.#url;
    }
  }

  // Getters
  get description() { return this.#description; }
  get title() { return this.#title; }
  get url() { return this.#url; }

  // Setters with validation
  set description(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("Description must be a non-empty string");
    }
    this.#description = value;
  }

  set title(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("Title must be a non-empty string");
    }
    this.#title = value;
  }

  set url(value) {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error("URL must be a non-empty string");
    }
    this.#url = value;
  }

  // Validate project data
  validate() {
    if (!this.#title || this.#title.trim() === "") {
      throw new Error("Project title is required");
    }

    if (!this.#description || this.#description.trim() === "") {
      throw new Error("Project description is required");
    }

    return true;
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    return {
      title: this.#title,
      url: this.#url,
      description: this.#description
    };
  }
}

export default Project;