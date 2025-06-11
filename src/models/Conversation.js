import { enforceSchema } from "../constants/data";

const conversationSchema = {
  archivedBy: [], // Array of user ID's
  deletedOnBy: [], // Array of objects with user ID and timestamp
  formerParticipants: [], // Array of user ID's
  messages: [], // Subcollection of Message objects
  moderators: [], // Array of user ID's
  participants: [], // Array of user ID's
  starredBy: [], // Array of user ID's
  subject: ""
};

class Conversation {
  constructor(data) {
    // Apply schema validation
    enforceSchema(data, conversationSchema);
    Object.assign(this, data);

  }

  // Validate conversation data
  validate() {
    if (!this.subject || this.subject.trim() === "") {
      throw new Error("Conversation subject is required");
    }

    if (!this.participants || this.participants.length < 2) {
      throw new Error("Conversation must have at least 2 participants");
    }

    // Ensure all moderators are also participants
    if (this.moderators && this.moderators.length > 0) {
      const nonParticipantModerators = this.moderators.filter(
        (moderator) => !this.participants.includes(moderator)
      );

      if (nonParticipantModerators.length > 0) {
        throw new Error("All moderators must also be participants");
      }
    }

    return true;
  }

  // Add a participant
  addParticipant(id) {
    if (!this.participants.includes(id)) {
      this.participants.push(id);

      // If they were previously removed, take them out of formerParticipants
      this.formerParticipants = this.formerParticipants.filter(
        participant => participant !== id
      );
    }
  }

  // Remove a participant
  removeParticipant(id) {
    if (this.participants.includes(id)) {
      this.participants = this.participants.filter(
        participant => participant !== id
      );

      // Add to former participants list
      if (!this.formerParticipants.includes(id)) {
        this.formerParticipants.push(id);
      }

      // Also remove from moderators if present
      this.moderators = this.moderators.filter(
        moderator => moderator !== id
      );
    }
  }

  // Add a moderator (must be a participant)
  addModerator(id) {
    if (!this.participants.includes(id)) {
      throw new Error("User must be a participant before becoming a moderator");
    }

    if (!this.moderators.includes(id)) {
      this.moderators.push(id);
    }
  }

  // Remove a moderator
  removeModerator(id) {
    this.moderators = this.moderators.filter(moderator => moderator !== id);
  }

  // Check if user is a participant
  isParticipant(id) {
    return this.participants.includes(id);
  }

  // Check if user is a moderator
  isModerator(id) {
    return this.moderators.includes(id);
  }

  // Archive conversation for a user
  archiveFor(userId) {
    if (!this.archivedBy.includes(userId)) {
      this.archivedBy.push(userId);
    }
  }

  // Unarchive conversation for a user
  unarchiveFor(userId) {
    this.archivedBy = this.archivedBy.filter(id => id !== userId);
  }

  // Check if archived by a user
  isArchivedBy(userId) {
    return this.archivedBy.includes(userId);
  }

  // Star conversation for a user
  starFor(userId) {
    if (!this.starredBy.includes(userId)) {
      this.starredBy.push(userId);
    }
  }

  // Unstar conversation for a user
  unstarFor(userId) {
    this.starredBy = this.starredBy.filter(id => id !== userId);
  }

  // Check if starred by a user
  isStarredBy(userId) {
    return this.starredBy.includes(userId);
  }

  // Delete conversation for a user
  deleteFor(userId) {
    const now = new Date();
    const deleteEntry = { userId, timestamp: now };

    // Remove any existing delete entry for this user
    this.deletedOnBy = this.deletedOnBy.filter(entry => entry.userId !== userId);

    // Add the new delete entry
    this.deletedOnBy.push(deleteEntry);
  }

  // Undelete conversation for a user
  undeleteFor(userId) {
    this.deletedOnBy = this.deletedOnBy.filter(entry => entry.userId !== userId);
  }

  // Check if deleted by a user
  isDeletedBy(userId) {
    return this.deletedOnBy.some(entry => entry.userId === userId);
  }

  // Get deletion timestamp for a user
  getDeletionTimestamp(userId) {
    const entry = this.deletedOnBy.find(entry => entry.userId === userId);
    return entry ? entry.timestamp : null;
  }

  // Add a message to the conversation
  addMessage(message) {
    if (!this.messages) this.messages = [];
    this.messages.push(message);
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    // Create a copy of the object without methods
    const document = { ...this };

    // Remove any undefined values and the id field (as it's the document ID)
    Object.keys(document).forEach(key => {
      if (document[key] === undefined || key === "id") {
        delete document[key];
      }
    });

    // Handle messages separately as they'll be stored in a subcollection
    delete document.messages;

    return document;
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;
    return new Conversation({
      ...doc.data(),
      id: doc.id
    });
  }
}

export default Conversation;