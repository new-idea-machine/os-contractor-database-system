/**
 * @fileoverview Conversation data model for managing multi-user chat conversations.
 *
 * This module implements the Conversation class, providing functionality for storing and
 * managing chat conversations within the contractor database system.  Each conversation
 * includes participant management, moderation capabilities, subject tracking, and per-user
 * metadata such as archived status, starred status, and soft deletion.
 *
 * The Conversation model supports multi-user conversations where each user can independently
 * manage their view of conversations (archiving, starring, or soft-deleting) without
 * affecting other users' views.  Conversations have a moderation system where designated
 * moderators can manage participants, change the subject, and perform administrative tasks.
 *
 * Key features:
 * - Multi-user conversation management with participant tracking
 * - Moderation system with role-based permissions
 * - Former participant tracking for conversation history
 * - Per-user conversation state management (archived, starred, deleted)
 * - Automatic timestamp generation via Firebase serverTimestamp
 * - Soft deletion with timestamp tracking per user
 * - Automatic cleanup detection for fully deleted conversations
 * - Firebase-compatible document serialization
 * - Validation for all properties and operations
 *
 * @example
 * import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs } from "firebase/firestore";
 * import { db } from "../firebase";
 * import Conversation from "../models/Conversation";
 *
 * // Fetch a document from Firebase using automatic converter
 *
 * const conversationRef = doc(db, "conversations", conversationId).withConverter(Conversation.firebaseConverter);
 * const conversationSnap = await getDoc(conversationRef);
 * const conversation = conversationSnap.data();  // Already a Conversation instance
 *
 * // Access conversation data
 *
 * console.log(`Subject: ${conversation.subject}`);
 * console.log(`Participants: ${conversation.participants.length}`);
 * console.log(`Is moderator: ${conversation.isModerator}`);
 *
 * // Update conversation properties and save back to Firebase (automatic conversion to plain object)
 *
 * if (conversation.isModerator) {
 *   conversation.subject = "Updated conversation subject";
 *   conversation.addParticipant("user_0789");
 * }
 * await setDoc(conversationRef, conversation);
 *
 * // Or update specific fields without converter
 *
 * const conversationData = conversation.toFirebaseDocument();
 * conversationData.subject = "Updated without automatic conversion";
 * await updateDoc(doc(db, "conversations", conversationId), conversationData);
 *
 * @module models/Conversation
 * @requires firebase/firestore
 * @requires constants/data
 */

import { Timestamp, serverTimestamp } from "firebase/firestore";
import { isValidFirebaseUserUID, enforceTrimmedString, enforceTimestamp } from "../constants/data";

/**
 * Conversation model for storing and managing multi-user chat conversations.
 *
 * This class encapsulates conversation information including participants, moderators,
 * subject, timestamp, and per-user metadata.  It provides methods for managing conversation
 * state independently for each user (archived, starred, deleted status) and administrative
 * functions for moderators (adding/removing participants, changing subject).
 *
 * Conversations support:
 * - Multi-user participation with role-based permissions
 * - Moderation capabilities for designated users
 * - Former participant tracking for conversation history
 * - Soft deletion where each user can delete a conversation from their view
 * - Automatic cleanup detection when all users have deleted the conversation
 *
 * @class Conversation
 * @example
 * // Create a new conversation (current user becomes first participant and moderator)
 *
 * const conversation = new Conversation({
 *   subject: "Project Discussion"
 * });
 *
 * // Add participants (requires moderator role)
 *
 * conversation.addParticipant("user_0123");
 * conversation.addParticipant("user_0456");
 *
 * // Promote a participant to moderator
 *
 * conversation.addModerator("user_0123");
 */
class Conversation {
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
    return Conversation.#currentUserId;
  }

  // Static setters

  /**
   * Set the current user ID context for all Conversation instances.
   *
   * This should be set whenever a user logs in or logs out.
   *
   * @static
   * @param {?string} userId - The authenticated user's ID, or null to clear
   * @throws {Error} If userId is not valid
   * @example
   * import { UserAuth } from '../contexts/Authorization';
   * import Conversation from '../models/Conversation';
   *
   * function App() {
   *   const { userId } = UserAuth();
   *
   *   useEffect(() => {
   *     Conversation.currentUserId = userId;
   *   }, [userId]);
   * }
   */
  static set currentUserId(userId) {
    if ((userId !== null) && !isValidFirebaseUserUID(userId)) {
      throw new Error("userId must be either null or a valid Firebase UserUID");
    }

    Conversation.#currentUserId = userId;
  }

  // Private members

  /**
   * Array of user IDs who have archived this conversation
   * @private
   * @type {string[]}
   */
  #archivedBy = [];

  /**
   * Timestamp when the conversation was created (generated by Firebase serverTimestamp())
   * @private
   * @type {?Timestamp}
   */
  #createdOn = null;

  /**
   * Array of deletion records, each containing userId and timestamp
   * @private
   * @type {Array<{userId: string, timestamp: Timestamp}>}
   */
  #deletedOnBy = [];

  /**
   * Array of user IDs who were previously participants but have left or been removed
   * @private
   * @type {string[]}
   */
  #formerParticipants = [];

  /**
   * Array of user IDs who have moderator privileges for this conversation
   * @private
   * @type {string[]}
   */
  #moderators = [];

  /**
   * Array of user IDs who are current participants in this conversation
   * @private
   * @type {string[]}
   */
  #participants = [];

  /**
   * Array of user IDs who have starred this conversation
   * @private
   * @type {string[]}
   */
  #starredBy = [];

  /**
   * The subject of the conversation
   * @private
   * @type {string}
   */
  #subject = "";

  // Constructor

  /**
   * Create a new Conversation instance.
   *
   * If no participants are provided then the current user will be added as the first
   * participant and moderator.
   *
   * When creating a brand new conversation (as opposed to populating a new instance with
   * existing data), set the "createdOn" member to "null" -- the timestamp will be generated
   * automatically by Firebase when the instance is first saved.
   *
   * @constructor
   * @param {Object} [data={}] - Conversation data object
   * @param {string[]} [data.archivedBy=[]] - Array of user IDs who have archived this conversation
   * @param {Timestamp} [data.createdOn] - Conversation creation timestamp (auto-generated by Firebase)
   * @param {Array<{userId: string, timestamp: Timestamp}>} [data.deletedOnBy=[]] - Array of deletion records
   * @param {string[]} [data.formerParticipants=[]] - Array of former participant user IDs
   * @param {string[]} [data.moderators=[]] - Array of moderator user IDs
   * @param {string[]} [data.participants=[]] - Array of current participant user IDs
   * @param {string[]} [data.starredBy=[]] - Array of user IDs who have starred this conversation
   * @param {string} [data.subject=""] - The conversation subject/title
   * @throws {Error} If no participants are provided and current user is not set
   */

  constructor(data = {}) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      this.#createdOn = (data.createdOn ? enforceTimestamp(data.createdOn) : this.#createdOn);
      this.#subject = enforceTrimmedString(data.subject);

      // Process archivedBy array

      if (Array.isArray(data.archivedBy)) {
        data.archivedBy.forEach(userId => {
          if (isValidFirebaseUserUID(userId)) {
            this.#archivedBy.push(userId);
          }
        });
      }

      // Process deletedOnBy array

      if (Array.isArray(data.deletedOnBy)) {
        data.deletedOnBy.forEach((deletionData) => {
          if (typeof deletionData === "object" && !Array.isArray(deletionData)) {
            const timestamp = enforceTimestamp(deletionData.timestamp);

            if (isValidFirebaseUserUID(deletionData.userId) && timestamp) {
              this.#deletedOnBy.push({ userId: deletionData.userId, timestamp });
            }
          }
        });
      }

      // Process former participants array

      if (Array.isArray(data.formerParticipants)) {
        data.formerParticipants.forEach(userId => {
          if (isValidFirebaseUserUID(userId)) {
            this.#formerParticipants.push(userId);
          }
        });
      }

      // Process moderators array

      if (Array.isArray(data.moderators)) {
        data.moderators.forEach(userId => {
          if (isValidFirebaseUserUID(userId)) {
            this.#moderators.push(userId);
          }
        });
      }

      // Process participants array

      if (Array.isArray(data.participants)) {
        data.participants.forEach(userId => {
          if (isValidFirebaseUserUID(userId)) {
            this.#participants.push(userId);
          }
        });
      }

      // Process starredBy array

      if (Array.isArray(data.starredBy)) {
        data.starredBy.forEach(userId => {
          if (isValidFirebaseUserUID(userId)) {
            this.#starredBy.push(userId);
          }
        });
      }
    }

    if (this.#participants.length === 0) {
      const userId = Conversation.#currentUserId;

      if (!userId) {
        throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
      }

      this.#participants.push(userId);
      this.#moderators.push(userId);
    }
  }

  // Getters

  /**
   * Get the conversation creation timestamp.
   * @returns {?Timestamp} Conversation timestamp, or null if not yet saved to Firebase
   */
  get createdOn() { return this.#createdOn; }

  /**
   * Get the array of former participant user IDs.
   * @returns {string[]} Array of former participant user IDs
   */
  get formerParticipants() { return this.#formerParticipants; }

  /**
   * Get the array of moderator user IDs.
   * @returns {string[]} Array of moderator user IDs
   */
  get moderators() { return this.#moderators; }

  /**
   * Get the array of current participant user IDs.
   * @returns {string[]} Array of current participant user IDs
   */
  get participants() { return this.#participants; }

  /**
   * Get the conversation subject/title.
   * @returns {string} Conversation subject
   */
  get subject() { return this.#subject; }

  /**
   * Check if this conversation is archived by the current user.
   * @returns {boolean} True if archived by current user
   * @throws {Error} If current user is not set
   */
  get isArchived() {
    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    return this.#archivedBy.includes(userId);
  }

  /**
   * Check if this conversation was deleted by the current user.
   * @returns {boolean} True if deleted by current user
   * @throws {Error} If current user is not set
   */
  get isDeleted() {
    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    return this.#deletedOnBy.some((deletionData) => deletionData.userId === userId);
  }

  /**
   * Check if the current user is a moderator of this conversation.
   * @returns {boolean} True if current user is a moderator
   * @throws {Error} If current user is not set
   */
  get isModerator() {
    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    return this.#moderators.includes(userId);
  }

  /**
   * Check if this conversation is starred by the current user.
   * @returns {boolean} True if starred by current user
   * @throws {Error} If current user is not set
   */
  get isStarred() {
    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    return this.#starredBy.includes(userId);
  }

  // Setters with validation

  /**
   * Set the conversation subject/title.
   *
   * Only moderators can change the conversation subject.
   *
   * @param {string} value - The new conversation subject (must be non-empty after trimming)
   * @throws {Error} If current user is not a moderator
   * @throws {Error} If value is not a non-empty string
   */
  set subject(value) {
    if (!this.isModerator) {
      throw new Error("Only moderators can change the subject.");
    }

    const newValue = enforceTrimmedString(value);

    if (newValue === "") {
      throw new Error("Value must be a non-empty string");
    }

    this.#subject = newValue;
  }

  /**
   * Archive or unarchive this conversation for the current user.
   * @param {boolean} value - True to archive, false to unarchive
   * @throws {Error} If current user is not set or value is not a boolean
   */
  set isArchived(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    const conversationIsArchived = this.#archivedBy.includes(userId);

    if (value && !conversationIsArchived) {
      this.#archivedBy.push(userId);
    } else if (!value && conversationIsArchived) {
      this.#archivedBy = this.#archivedBy.filter((id) => id !== userId);
    }
  }

  /**
   * Mark or unmark this conversation as deleted for the current user.
   * @param {boolean} value - True to mark as deleted, false to restore
   * @throws {Error} If current user is not set or value is not a boolean
   */
  set isDeleted(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    const conversationIsDeleted = this.#deletedOnBy.some((deletionData) => deletionData?.userId === userId);

    if (value && !conversationIsDeleted) {
      this.#deletedOnBy.push({ userId, timestamp:  serverTimestamp() });
    } else if (!value && conversationIsDeleted) {
      this.#deletedOnBy = this.#deletedOnBy.filter((deletionData) => deletionData?.userId !== userId);
    }
  }

  /**
   * Star or unstar this conversation for the current user.
   * @param {boolean} value - True to star, false to unstar
   * @throws {Error} If current user is not set or value is not a boolean
   */
  set isStarred(value) {
    if (typeof value !== "boolean") {
      throw new Error("Value must be a boolean");
    }

    const userId = Conversation.#currentUserId;

    if (!userId) {
      throw new Error("Current user not set.  Call Conversation.setCurrentUser() first.");
    }

    const conversationIsStarred = this.#starredBy.includes(userId);

    if (value && !conversationIsStarred) {
      this.#starredBy.push(userId);
    } else if (!value && conversationIsStarred) {
      this.#starredBy = this.#starredBy.filter((id) => id !== userId);
    }
  }

  // Methods

  /**
   * Check if all users have deleted this conversation within the specified time period.
   *
   * This method determines whether all users who have deleted this conversation did so
   * within the specified number of days.  This is useful for determining when a conversation
   * can be automatically cleaned up.
   *
   * @param {number} numDays - Number of days to check for deletions
   * @returns {boolean} True if all deletions occurred within the specified time period
   * @example
   * // Check if conversation was deleted by all users within 30 days or has no participants
   *
   * if (conversation.allUsersDeleted(30) || (conversations.participants.length === 0)) {
   *   // Conversation can be safely deleted from database
   * }
   */
  allUsersDeleted(numDays) {
    const numMilliseconds = numDays * 24 * 60 * 60 * 1000;
    const expiryLimit = Timestamp.fromMillis(Date.now() - numMilliseconds).valueOf();

    return this.#deletedOnBy.every(entry => entry.timestamp.valueOf() <= expiryLimit);
  }

  /**
   * Add a participant to this conversation.
   *
   * Only moderators can add participants.  The added user will be added to the participants
   * list and removed from the former participants list if they were previously a participant.
   *
   * @param {string} userId - The user ID to add as a participant
   * @throws {Error} If current user is not a moderator or userId is invalid
   */
  addParticipant(userId) {
    if (!isValidFirebaseUserUID(userId)) {
      throw new Error("Participant user ID isn't valid");
    }

    if (!this.isModerator()) {
      throw new Error("Only moderators can add participants");
    }

    if (!this.#participants.includes(userId)) {
      this.#participants.push(userId);

      this.#formerParticipants = this.#formerParticipants.filter((participant) => participant !== userId);
    }
  }

  /**
   * Remove a participant from this conversation.
   *
   * Only moderators can remove participants, or the current user can remove themself.  The
   * removed user will be removed from the list of participants and added to the list of former
   * participants.  If the user is a moderator then they will also be demoted.
   *
   * IMPORTANT:  A conversation must always have at least one moderator when it has
   * participants.  If removing this participant would leave the conversation without
   * moderators then an error will be thrown.  In this case, promote another participant to
   * moderator first.
   *
   * @param {string} userId - The user ID to remove as a participant
   * @throws {Error} If current user is not a moderator or participant, or userId is invalid
   * @throws {Error} If removing this participant would leave the conversation without moderators
   * @example
   * // Remove a participant from a conversation
   *
   * conversation.removeParticipant("user_0456");
   *
   * // If removing the last moderator, promote someone else first
   *
   * if (conversation.moderators.length === 1 && conversation.moderators[0] === userId) {
   *   conversation.addModerator("user_0789");  // Promote another participant first
   * }
   *
   * conversation.removeParticipant(userId);
   */
  removeParticipant(userId) {
    if (!isValidFirebaseUserUID(userId)) {
      throw new Error("Participant user ID isn't valid");
    }

    if (!this.isModerator() && (userId !== Conversation.currentUserId)) {
      throw new Error("Only moderators can remove participants");
    }

    if (this.#participants.includes(userId)) {
      // If user is a moderator, demote them first (this will check for moderator constraints)

      if (this.#moderators.includes(userId)) {
        this.removeModerator(userId);
      }

      // Remove from participants and add to former participants if not already there

      this.#participants = this.#participants.filter((participant) => participant !== userId);

      if (!this.#formerParticipants.includes(userId)) {
        this.#formerParticipants.push(userId);
      }
    }
  }

  /**
   * Promote a conversation participant to moderator.
   *
   * Only moderators can promote participants to moderators.  The user must already be a
   * participant.
   *
   * @param {string} userId - The user ID to promote to moderator
   * @throws {Error} If current user is not a moderator or userId is invalid
   * @throws {Error} If user is not a participant
   */
  addModerator(userId) {
    if (!isValidFirebaseUserUID(userId)) {
      throw new Error("Moderator user ID isn't valid");
    }

    if (!this.isModerator()) {
      throw new Error("Only moderators can promote participants to moderators");
    }

    if (!this.#participants.includes(userId)) {
      throw new Error("User must be a participant before becoming a moderator");
    }

    if (!this.#moderators.includes(userId)) {
      this.#moderators.push(userId);
    }
  }

  /**
   * Demote a moderator in this conversation to participant.
   *
   * Only moderators can demote moderators.
   *
   * IMPORTANT:  A conversation must always have at least one moderator when it has
   * participants.  If demoting this moderator would leave the conversation without moderators
   * then an error will be thrown.  In this case, promote another participant to moderator
   * first.
   *
   * @param {string} userId - The user ID to demote from moderator
   * @throws {Error} If current user is not a moderator or userId is invalid
   * @throws {Error} If removing this moderator would leave the conversation without moderators
   * @example
   * // Demote a moderator to participant
   *
   * conversation.removeModerator("user_0123");
   *
   * // If removing the last moderator, promote someone else first
   *
   * if (conversation.moderators.length === 1) {
   *   conversation.addModerator("user_0789");  // Promote another participant first
   * }
   *
   * conversation.removeModerator(userId);
   */
  removeModerator(userId) {
    if (!isValidFirebaseUserUID(userId)) {
      throw new Error("Moderator user ID isn't valid");
    }

    if (!this.isModerator()) {
      throw new Error("Only moderators can demote moderators to participants");
    }

    const userIsOnlyModerator = (this.#moderators.length === 1) && (this.#moderators[0] === userId)

    if (userIsOnlyModerator && (this.#participants.length > 1))  {
        throw new Error(
          "Cannot remove this moderator -- conversation would have no moderators.  " +
          "Promote another participant to moderator first using addModerator()."
        );
      }
  }

  /**
   * Convert this conversation to a plain JavaScript object suitable for Firebase Firestore.
   *
   * This method prepares the conversation data for storage in Firestore, including all
   * necessary metadata and arrays. The createdOn timestamp is only included if it's not
   * already set (i.e., when creating a new document).
   *
   * @returns {Object} Plain object representation of the conversation for Firestore
   * @example
   * // Save conversation to Firestore
   *
   * const conversationData = conversation.toFirebaseDocument();
   * await setDoc(doc(db, "conversations", conversationId), conversationData);
   */
  toFirebaseDocument() {
    const doc = {
      archivedBy:  this.#archivedBy,
      deletedOnBy:  this.#deletedOnBy,
      formerParticipants:  this.#formerParticipants,
      moderators:  this.#moderators,
      participants:  this.#participants,
      starredBy:  this.#starredBy,
      subject:  this.#subject
    };

    // Only set createdOn if we're creating a new document

    if (!this.#createdOn) {
      doc.createdOn = serverTimestamp();
    }

    return doc;
  }

  /**
   * Firebase Firestore converter for automatic conversion between Conversation instances and Firestore documents.
   *
   * This converter enables direct use of Conversation instances with Firestore operations:
   * - `doc.withConverter(Conversation.firebaseConverter)` for reading/writing documents
   * - Automatic conversion from Firestore documents to Conversation instances
   * - Automatic conversion from Conversation instances to Firestore documents
   *
   * @example
   * // Reading a conversation from Firestore
   *
   * const conversationRef = doc(db, "conversations", conversationId).withConverter(Conversation.firebaseConverter);
   * const conversationSnap = await getDoc(conversationRef);
   * const conversation = conversationSnap.data();  // Returns Conversation instance
   *
   * // Writing a conversation to Firestore
   *
   * await setDoc(conversationRef, conversation);  // Automatically converted to plain object
   */
  static firebaseConverter = {
    fromFirestore:  (snapshot, options) => new Conversation(snapshot.data(options)),
    toFirestore:  (conversation) => conversation.toFirebaseDocument()
  };
}

export default Conversation;