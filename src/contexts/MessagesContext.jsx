import React, { useState, useEffect, createContext, useContext } from 'react';
import { store, auth, db, fbFunctions } from '../firebaseconfig';
import {
	doc,
	addDoc,
	getDoc,
	onSnapshot,
	setDoc,
	serverTimestamp,
	updateDoc,
	collection,
	query,
	getDocs,
	where,
	orderBy,
	Timestamp
} from 'firebase/firestore';
import { authContext } from './Authorization';
import { contractorContext } from './ContractorContext';
import { recruiterContext } from "./RecruiterContext";

export const messagesContext = createContext();

const compareDates = (lhs, rhs) => {
	const convertDate = (date) => {
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
	const [receivedMessages, setReceivedMessages] = useState([]);
	const [sentMessages, setSentMessages] = useState([]);
	const [receivedUnsubscribe, setReceivedUnsubscribe] = useState(null);
	const [sentUnsubscribe, setSentUnsubscribe] = useState(null);
	const [chatsList, setChatsList] = useState([]);

	useEffect(() => {
		const fetchMessages = (field, setMessages, setUnsubscribe) => {
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
				(error) => {console.error(`Error fetching messages for "${field}":`, error);})

			);
		}

		if (receivedUnsubscribe) {
			receivedUnsubscribe();
		}

		if (sentUnsubscribe) {
			sentUnsubscribe();
		}

		if (user) {
			fetchMessages('receiverUid', setReceivedMessages, setReceivedUnsubscribe);
			fetchMessages('uid', setSentMessages, setSentUnsubscribe);
		} else {
			setReceivedMessages([]);
			setSentMessages([]);
			setReceivedUnsubscribe(null);
			setSentUnsubscribe(null);
		}
	}, [user]);

	useEffect(() => {
		if (user?.uid) {
			const allMessages = sentMessages.concat(receivedMessages);

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

				chat.name = message.name;
				chat.avatar = message.avatar;

				if ((message.receiverUid === user.uid) && (message.hasRead !== true))
					chat.newMessageCount++;
			}

			setChatsList(newChats);
		} else {
			setChatsList([]);
		}
	}, [receivedMessages, sentMessages]);

	const getNumUnreadMessages = () => {
		const totalUnreadMessages = chatsList.reduce((acc, message) => {
				return acc + message.newMessageCount;
			}, 0);
		return totalUnreadMessages;
	}

	const appStates = {
		chatsList,
		getNumUnreadMessages
	};

	return (
		<messagesContext.Provider value={appStates}>
			{children}
		</messagesContext.Provider>
	);
};

export default MessagesContext;