import { enforceSchema } from "../constants/data";

const projectSchema = {
  description: "",
  title: "",
  url: ""
};

class Project {
  constructor(data) {
    // Apply schema validation
    enforceSchema(data, projectSchema);
    Object.assign(this, data);
  }

  // Validate project data
  validate() {
    if (!this.title || this.title.trim() === "") {
      throw new Error("Project title is required");
    }

    if (!this.description || this.description.trim() === "") {
      throw new Error("Project description is required");
    }

    return true;
  }

  // Convert to plain object for Firebase storage
  toObject() {
    return {
      title: this.title,
      url: this.url,
      description: this.description
    };
  }
}

export default Project;