import { enforceSchema } from '../constants/data';

const messageSchema = {
  id: '',
  conversation_id: '',
  archivedBy: [], // Array of UIDs
  author: '',
  deletedOnBy: [], // Array of objects with user ID and timestamp
  readBy: [], // Array of UIDs
  starredBy: [], // Array of UIDs
  text: '',
  timestamp: null
};

class Message {
  constructor(data) {
    // Apply schema validation
    enforceSchema(data, messageSchema);
    Object.assign(this, data);

    // Initialize arrays if they don't exist
    this.archivedBy = this.archivedBy || [];
    this.deletedOnBy = this.deletedOnBy || [];
    this.readBy = this.readBy || [];
    this.starredBy = this.starredBy || [];

    // Set timestamp if not provided
    if (!this.timestamp) {
      this.timestamp = new Date();
    }
  }

  // Validate message data
  validate() {
    if (!this.conversation_id) {
      throw new Error('Conversation ID is required');
    }

    if (!this.author) {
      throw new Error('Author is required');
    }

    if (!this.text || this.text.trim() === '') {
      throw new Error('Message text cannot be empty');
    }

    return true;
  }

  // Check if message is deleted by a specific user
  isDeletedBy(userId) {
    return this.deletedOnBy.some(entry => entry.userId === userId);
  }

  // Get deletion timestamp for a user
  getDeletionTimestamp(userId) {
    const entry = this.deletedOnBy.find(entry => entry.userId === userId);
    return entry ? entry.timestamp : null;
  }

  // Mark as read by a user
  markAsRead(uid) {
    if (uid !== this.author && !this.readBy.includes(uid)) {
      this.readBy.push(uid);
    }
  }

  // Check if read by a user
  isReadBy(uid) {
    return this.readBy.includes(uid);
  }

  // Archive for a user
  archiveFor(uid) {
    if (!this.archivedBy.includes(uid)) {
      this.archivedBy.push(uid);
    }
  }

  // Unarchive for a user
  unarchiveFor(uid) {
    this.archivedBy = this.archivedBy.filter(id => id !== uid);
  }

  // Check if archived by a user
  isArchivedBy(uid) {
    return this.archivedBy.includes(uid);
  }

  // Star for a user
  starFor(uid) {
    if (!this.starredBy.includes(uid)) {
      this.starredBy.push(uid);
    }
  }

  // Unstar for a user
  unstarFor(uid) {
    this.starredBy = this.starredBy.filter(id => id !== uid);
  }

  // Check if starred by a user
  isStarredBy(uid) {
    return this.starredBy.includes(uid);
  }

  // Delete message for a user
  deleteFor(userId) {
    const now = new Date();
    const deleteEntry = { userId, timestamp: now };

    // Remove any existing delete entry for this user
    this.deletedOnBy = this.deletedOnBy.filter(entry => entry.userId !== userId);

    // Add the new delete entry
    this.deletedOnBy.push(deleteEntry);
  }

  // Undelete message for a user
  undeleteFor(userId) {
    this.deletedOnBy = this.deletedOnBy.filter(entry => entry.userId !== userId);
  }

  // Convert to Firebase document
  toFirebaseDocument() {
    // Create a copy of the object without methods
    const document = { ...this };

    // Remove any undefined values and the id field (as it's the document ID)
    Object.keys(document).forEach(key => {
      if (document[key] === undefined || key === 'id') {
        delete document[key];
      }
    });

    return document;
  }

  // Create from Firebase document
  static fromFirebaseDocument(doc) {
    if (!doc) return null;
    return new Message({
      ...doc.data(),
      id: doc.id
    });
  }
}

export default Message;