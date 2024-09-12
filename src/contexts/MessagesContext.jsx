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
} from 'firebase/firestore';
import { authContext } from './Authorization';
import { contractorContext } from './ContractorContext';
import { recruiterContext } from "./RecruiterContext";

export const messagesContext = createContext();

const MessagesContext = ({ children }) => {
	const { user } = useContext(authContext);
	const [messages, setMessages] = useState([]);

	const fetchMessages = async (field) => {
		const messagesQuery = query(
			collection(db, 'messages'),
			where(field, '==', user.uid)
		);


		try {
			const querySnapshot = await getDocs(messagesQuery);
			const fetchedMessages = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			return fetchedMessages;
		}
		catch(error) {
			console.error('Error fetching messages:', error);
			return [];
		}
	}

	const getMessages = async () => {
		if (user?.uid) {
			// uid & receiverUid

			const sentMessages = await fetchMessages('uid');
			const receivedMessages = await fetchMessages('receiverUid');
			const allMessages = sentMessages.concat(receivedMessages);

			allMessages.sort((lhs, rhs) => lhs?.createdAt < rhs?.createdAt ? -1 : 1);
			console.log(allMessages);
			setMessages(allMessages);
		}

	}

	const getUnreadMessages = () =>	{
		if (user?.uid)
			return messages.filter((message) => (message?.receiverUid === user.uid) && !message?.hasRead);
		else
			return [];
	}

	useEffect(() =>	{
		if (user?.uid) {
			getMessages();
		}
	}, [user]);



	const appStates = {
		setMessages,
		messages,
		getMessages,
		getUnreadMessages
	};

	return (
		<messagesContext.Provider value={appStates}>
			{children}
		</messagesContext.Provider>
	);
};

export default MessagesContext;