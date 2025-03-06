import React from 'react';
import ProfilePicture from '../ProfilePicture';

import { ReactComponent as IconArchive } from "../../assets/icons/archiveChat.svg";
import { ReactComponent as IconTrash } from "../../assets/icons/trashChat.svg";

import styles from './Correspondents.module.css';

function Correspondents({ chatsList, setCurrentCorrespondentUid }) {
	return (
		<ul className={styles.Correspondents}>
			{chatsList?.map((chat) => (
				<li key={chat.uid} onClick={() => setCurrentCorrespondentUid(chat.uid)}>
					<ProfilePicture profileImage={chat.avatar} size="60px" />
					<div className={styles.Name}>
						{chat.firstName}{" "}{chat.lastName}
					</div>
					<div className={styles.Actions}>
						<IconArchive />
						<IconTrash />
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