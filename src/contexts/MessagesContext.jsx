import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
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

const compareDates = (lhs, rhs) => {
	const convertDate = (date) => {
		if (date === null)
			return null;
		if (typeof date === "string")
			return new Date(date.replaceAll(" at ", " "));
		if (typeof date === "number")
			return new Date(date)
		else if (typeof date === "object") {
			if (Date.prototype.isPrototypeOf(date))
				return date;
			else {
				const timestamp = new Timestamp(date.seconds, date.nanoseconds);

				return timestamp.toDate();
			}
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
	const { getUserProfile } = useContext(userProfileContext);
	const receivedMessages = useRef([]);
	const sentMessages = useRef([]);
	const receivedUnsubscribe = useRef(null);
	const sentUnsubscribe = useRef(null);
	const [chatsList, setChatsList] = useState([]);

	useEffect(() => {
		const fetchMessages = (field, messagesRef, unsubscribeRef) => {
			const messagesQuery = query(
				collection(db, 'messages'),
				where(field, '==', user.uid)
			);

			unsubscribeRef.current = onSnapshot(messagesQuery,
				(snapshot) => {
					messagesRef.current = snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));

					updateChatsList();
				},
				(error) => {console.error(`Error fetching messages for "${field}":`, error);});
		}

		if (receivedUnsubscribe.current) {
			receivedUnsubscribe.current();
		}

		if (sentUnsubscribe.current) {
			sentUnsubscribe.current();
		}

		if (user) {
			fetchMessages('receiverUid', receivedMessages, receivedUnsubscribe);
			fetchMessages('uid', sentMessages, sentUnsubscribe);
		} else {
			receivedMessages.current = [];
			sentMessages.current = [];
			receivedUnsubscribe.current = null;
			sentUnsubscribe.current = null;
			setChatsList([]);
		}
	}, [user]);

	const updateChatsList = () => {
		if (user?.uid) {
			const allMessages = sentMessages.current.concat(receivedMessages.current);

			allMessages.sort(compareDates);

			const newChats = [];

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
				This ensures that the latest name and avatar for each user is
				always used.
				*/

				chat.firstName = message.name;
				chat.lastName = null;
				chat.email = message.email;
				chat.qualification = message.qualification;
				chat.avatar = message.avatar;

				if ((message.receiverUid === user.uid) && (message.hasRead !== true))
					chat.newMessageCount++;
			}

			for (const chat of newChats) {
				const profile = getUserProfile(chat.uid);

				if (profile) {
					if (profile.name) {
						chat.firstName = profile.name;
						chat.lastName = '';
					} else {
						chat.firstName = profile.firstName;
						chat.lastName = profile.lastName;
					}

					chat.email = profile.email;
					chat.qualification = profile.qualification;
					chat.avatar = profile.avatar;
					// chat.avatar = "http://i2.cdn.turner.com/cnnnext/dam/assets/140428161531-bozo-the-clown-restricted-horizontal-large-gallery.jpg";
					chat.avatar = profile.profileImg;
				}
			}

			setChatsList(newChats);
		}
	}

	const getNumUnreadMessages = () => {
		const totalUnreadMessages = chatsList.reduce((acc, message) => {
				return acc + message.newMessageCount;
			}, 0);
		return totalUnreadMessages;
	}

	const updateHasRead = (chat) => {
		if (chat) {
			chat.messages.forEach((message) => {
				if (!message.hasRead) {
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