import React, { useState, useEffect, createContext, useContext } from 'react';
import { db } from '../firebaseconfig';
import {
	addDoc,
	doc,
	onSnapshot,
	collection,
	query,
	serverTimestamp,
	updateDoc,
	where,
	Timestamp
} from 'firebase/firestore';
import { authContext } from './Authorization';
import { userProfileContext } from './UserProfileContext';
import { enforceSchema, messageDataSchema } from '../constants/data';

export const messagesContext = createContext();

/*
This function compares two dates that may have come from Firebase message documents.  "lhs" is
the date on the left-hand side of the comparison; "rhs" is the date on the right-hand side.

In theory, all dates should be in the form of a Timestamp object.  In practice, as of this
writing, there's a lot of dirty data in the database, so this function takes all the different
possible formats into account.

It returns -1 if "lhs" is earlier than "rhs" (lhs < rhs), 1 if "lhs" is later than "rhs"
(lhs > rhs) or 0 if "lhs" and "rhs" are equal (lhs == rhs).  It is therefore suitable for use
as a comparison function when sorting an array.
*/

const compareDates = (lhs, rhs) => {
	/*
	This function converts "date" to an actual JavaScript Date object.
	*/

	const convertDate = (date) => {
		/*
		If "date" isn't a Firebase Timestamp data object then a zero-based Date object
		is returned instead.
		*/

		if (typeof date === "object") {
			const timestamp = new Timestamp(date?.seconds, date?.nanoseconds);

			return timestamp.toDate();
		}
		else
			return new Date(0);
	}

	const leftDate = convertDate(lhs.createdAt);
	const rightDate = convertDate(rhs.createdAt);

	return (leftDate < rightDate ? -1 : (leftDate > rightDate ? 1 : 0));
}

const MessagesContext = ({ children }) => {
	const { user } = useContext(authContext);
	const { contractors, recruiters, getUserProfile } = useContext(userProfileContext);
	const [receivedMessages, setReceivedMessages] = useState([]);
	const [sentMessages, setSentMessages] = useState([]);
	const [receivedUnsubscribe, setReceivedUnsubscribe] = useState(null);
	const [sentUnsubscribe, setSentUnsubscribe] = useState(null);
	const [chatsList, setChatsList] = useState([]);

	useEffect(() => {
		const subscribeToSnapshot = (field, setMessages, setUnsubscribe) => {
			const messagesQuery = query(
				collection(db, 'messages'),
				where(field, '==', user.uid)
			);

			setUnsubscribe(() => onSnapshot(messagesQuery,
				(snapshot) => {
					setMessages(snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					})));
				},
				(error) => {console.error(`Error fetching messages for "${field}":`, error);}));
		}

		if (receivedUnsubscribe)
			receivedUnsubscribe();

		if (sentUnsubscribe)
			sentUnsubscribe();

		if (user) {
			subscribeToSnapshot('receiverUid', setReceivedMessages, setReceivedUnsubscribe);
			subscribeToSnapshot('uid', setSentMessages, setSentUnsubscribe);
		} else {
			setReceivedMessages([]);
			setSentMessages([]);
			setReceivedUnsubscribe(null);
			setSentUnsubscribe(null);
		}
	}, [user]);

	/*
	This function updates "chatsList" by merging the contents of "sentMessages" &
	"receivedMessages" (grouping them by correspondent) and generating information about
	each correspondent.  The messages for each correspondent are sorted in chronological
	order.
	*/

	const updateChatsList = () => {
		if (user?.uid) {
			let allMessages = sentMessages.concat(receivedMessages);

			allMessages = allMessages.filter((message) => message.createdAt);
			allMessages.sort(compareDates);

			const newChats = [];

			/*
			This loop goes through each message one-by-one and determines its
			correspondent.  It then adds that message to that correspondent's array
			of messages in "newChats" (adding a new element if necessary).
			*/

			for (const message of allMessages) {
				let chat = newChats.find((element) => (element.uid === message.uid));

				if (chat === undefined) {
					chat = newChats.find((element) => (element.uid === message.receiverUid));

					if (chat === undefined) {
						chat = {
							uid:  (message.uid === user.uid ? message.receiverUid : message.uid),
							newMessageCount:  0,
							messages:  []
						}

						newChats.push(chat);
					}
				}

				chat.messages.push(message);

				/*
				This ensures that the latest name and avatar for each sender is
				always used in case the correspondent no longer exists.
				*/

				if (message.receiverUid === user.uid){
					chat.firstName = message.name;
					chat.lastName = null;
					chat.email = message.email;
					chat.qualification = message.qualification;
					chat.avatar = message.avatar;
				}

				if ((message.receiverUid === user.uid) && (message.hasRead !== true))
					chat.newMessageCount++;
			}

			/*
			This loop gets the most up-to-date information about each
			correspondent.
			*/

			for (const chat of newChats) {
				const profile = getUserProfile(chat.uid);

				if (profile) {
					chat.firstName = profile.firstName;
					chat.lastName = profile.lastName;
					chat.email = profile.email;
					chat.qualification = profile.qualification;
					chat.summary = profile.summary;

					if (profile.profileImg) {
						chat.avatar = profile.profileImg;
					}
				}
			}

			newChats.sort((lhs, rhs) => (
				lhs.firstName < rhs.firstName ? -1 : (
					lhs.firstName > rhs.firstName ? 1 : (
						lhs.lastName < rhs.lastName ? -1 : (
							lhs.lastName > rhs.lastName ? 1 : 0)))))

			setChatsList(newChats);
		}
	}

	useEffect(updateChatsList, [contractors, recruiters, receivedMessages, sentMessages]);

	const getNumUnreadMessages = () => {
		const totalUnreadMessages = chatsList.reduce((acc, message) => {
				return acc + message.newMessageCount;
			}, 0);
		return totalUnreadMessages;
	}

	const updateMessage = (message, updatedData) => {
		const messageRef = doc(db, "messages", message.id);
		const update = {};

		if (message.uid === user.uid) {
			if (Object.hasOwn(updatedData, "archive")) update.archived = updatedData.archive;
			if (Object.hasOwn(updatedData, "star")) update.starred = updatedData.star;
			if (Object.hasOwn(updatedData, "delete")) {
				update.deletedOn = updatedData.delete ? serverTimestamp() : null;
			}
		}
		else {
			if (Object.hasOwn(updatedData, "archive")) update.receiverArchived = updatedData.archive;
			if (Object.hasOwn(updatedData, "star"))  update.receiverStarred = updatedData.star;
			if (Object.hasOwn(updatedData, "delete")) {
				update.receiverDeletedOn = updatedData.delete ? serverTimestamp() : null;
			}
		}

		updateDoc(messageRef, update);
	}

	const updateHasRead = (chat) => {
		if (chat) {
			chat.messages.forEach((message) => {
				if ((message.uid === chat.uid) && !message.hasRead) {
					const messageRef = doc(db, "messages", message.id);

					updateDoc(messageRef, { hasRead: true });
				}
			})
		}
	};

	const sendMessage = (receiverUid, newMessage) => {
		if (receiverUid && (newMessage.trim() !== "")) {
			const profile = getUserProfile();
			let name = (profile?.firstName ? profile?.firstName : "");

			if (profile?.lastName) {
				if (name !== "")
					name += " ";

				name += profile.lastName;
			}

			addDoc(collection(db, "messages"), enforceSchema(
				{
					text: newMessage.trim(),
					name,
					email: profile?.email,
					avatar: profile?.profileImg || user?.photoURL,
					createdAt: serverTimestamp(),
					uid: user.uid,
					receiverUid: receiverUid,
				},
				messageDataSchema)
			);
		}
	};

	const appStates = {
		chatsList,
		getNumUnreadMessages,
		updateMessage,
		updateHasRead,
		sendMessage
	};

	return (
		<messagesContext.Provider value={appStates}>
			{children}
		</messagesContext.Provider>
	);
};

export default MessagesContext;