import React from 'react';
import ProfilePicture from '../ProfilePicture';

import styles from './Correspondents.module.css';

function Correspondents({ chatsList, setCurrentCorrespondentUid }) {
	return (
		<>
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