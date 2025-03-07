import React, { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebaseconfig";
import { messagesContext } from '../../contexts/MessagesContext';
import ProfilePicture from '../ProfilePicture';

import { ReactComponent as IconArchive } from "../../assets/icons/archiveChat.svg";
import { ReactComponent as IconTrash } from "../../assets/icons/trashChat.svg";

import styles from './Correspondents.module.css';

function Correspondents({ view, chatsList, setCurrentCorrespondentUid }) {
	const [user] = useAuthState(auth);
	const { updateMessage } = useContext(messagesContext);

	function moveArchivedMessages(chat) {
		for (const message of chat.messages) {
			const archived = (message.uid === user.uid ? message.archived : message.receiverArchived);

			updateMessage(message, {archive:  !archived})
		}
	}
	function moveDeleteMessages(chat) {
                for (const message of chat.messages) {
			const deleted = (message.uid === user.uid ? message.deletedOn !== null : message.receiverDeletedOn !== null);

			updateMessage(message, {delete:  !deleted})
                }
        }
	return (
		<ul className={styles.Correspondents}>
			{chatsList?.map((chat) => (
				<li key={chat.uid} onClick={() => setCurrentCorrespondentUid(chat.uid)}>
					<ProfilePicture profileImage={chat.avatar} size="60px" />
					<div className={styles.Name}>
						{chat.firstName}{" "}{chat.lastName}
					</div>
					<div className={styles.Actions}>
						<IconArchive className={view === "archived" ? styles.Distinct : null} onClick={() => moveArchivedMessages(chat)} />
						<IconTrash className={view === "deleted" ? styles.Distinct : null} onClick={() => moveDeleteMessages(chat)} />
					</div>
					<div className={styles.Qualification}>
						{chat.qualification}
					</div>
					<div className={styles.Summary} >
						{chat.newMessageCount === 0 || <div />}
						{chat.summary}
					</div>
				</li>
			))}
		</ul>
	);
}

export default Correspondents;