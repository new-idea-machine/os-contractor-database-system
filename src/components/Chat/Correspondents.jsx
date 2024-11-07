import React, { useContext } from 'react';
import { messagesContext } from '../../contexts/MessagesContext';
import ProfilePicture from '../ProfilePicture';

import styles from './Correspondents.module.css';

function Correspondents({ setCurrentCorrespondentUid }) {
	const { chatsList } = useContext(messagesContext);

	return (
		<>
			<h1>Chats</h1>

			<ul className={styles.Correspondents}>
				{chatsList?.map((chat) => (
					<li key={chat.uid} onClick={() => setCurrentCorrespondentUid(chat.uid)}>
						<ProfilePicture profileImage={chat.avatar} size="60px" />
						<div>
							{chat.newMessageCount === 0 || <div />}
							<span>
								{chat.firstName}{" "}
								{chat.lastName}
							</span><br />
							<span>{chat.qualification}</span>
						</div>
					</li>
				))}
			</ul>

		</>
	)
}

export default Correspondents;