import React, { useContext, useEffect, useState } from 'react';
import { auth } from "../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { messagesContext } from '../contexts/MessagesContext';
import { Navigation } from '../components';
import ChatBox from '../components/Chat/ChatBox';
import Correspondents from '../components/Chat/Correspondents';

import styles from './MyMessages.module.css';

const numDaysToKeepDeletedMessages = process.env.REACT_APP_numDaysToKeepDeletedMessages;
const millisecondsPerDay = (24 * 60 * 60 * 1000);
const deletedMessagesTimeLimit = numDaysToKeepDeletedMessages * millisecondsPerDay;

export default function MyMessages({ view }) {
	const [user] = useAuthState(auth);
	const { chatsList } = useContext(messagesContext);
	const [currentCorrespondentUid, setCurrentCorrespondentUid] = useState(null);

	function filterDeleted(message) {
		/* Filter out a deleted message. */
		const deletedOn = (message.uid === user.uid ? message.deletedOn : message.receiverDeletedOn)

		return (deletedOn === undefined || deletedOn === null);
	}

	function filterDeletedArchived(message) {
		/* Filter out a deleted, non-archived message. */
		const archived = (message.uid === user.uid ? message.archived : message.receiverArchived)

		return !archived && filterDeleted(message);
	}

	function filterDeletedNonArchived(message) {
		/* Filter out a deleted, non-archived message. */
		const archived = (message.uid === user.uid ? message.archived : message.receiverArchived)

		return archived && filterDeleted(message);
	}

	function filterDeletedNonStarred(message) {
		/* Filter out a deleted, non-starred message. */
		const starred = (message.uid === user.uid ? message.starred : message.receiverStarred)

		return starred && filterDeleted(message);
        }

	function filterNonDeleted(message) {
		/* Filter out a non-deleted message. */

		if (filterDeleted(message)) {
			return false;
		} else {
			const deletedOn = (message.uid === user.uid ? message.deletedOn : message.receiverDeletedOn)

			return (Date.now() - deletedOn.toDate() <= deletedMessagesTimeLimit);
		}
	}

	function filterChatsList(filter) {
		const newChatsList = [];

		chatsList.forEach((chat) => {
			const newChat = structuredClone(chat);

			newChat.messages = chat.messages.filter(filter);

			if (newChat.messages.length > 0)
				newChatsList.push(newChat);
		});

		return newChatsList;
	}

	let filter = filterDeletedArchived;

	if (view === "archived") filter = filterDeletedNonArchived;
	if (view === "starred") filter = filterDeletedNonStarred;
	if (view === "deleted") filter = filterNonDeleted;

	const filteredChatsList = filterChatsList(filter);

	useEffect(() => { setCurrentCorrespondentUid(null) }, []);

	return (
		<>
			<Navigation menu="Chat" />
			<main>
				<div className={styles.Correspondents}>
					<Correspondents chatsList={ filteredChatsList } setCurrentCorrespondentUid={ setCurrentCorrespondentUid } />
				</div>
				<div className={styles.ChatBox}>
					<ChatBox chatsList={ filteredChatsList } correspondentUid={ currentCorrespondentUid } />
				</div>
			</main>
		</>
	);
}