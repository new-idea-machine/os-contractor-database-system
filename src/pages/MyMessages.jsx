import React, { useEffect, useState } from 'react';
import { Navigation } from '../components';
import ChatBox from '../components/Chat/ChatBox';
import Correspondents from '../components/Chat/Correspondents';

import styles from './MyMessages.module.css';

export default function MyMessages() {
	const [currentCorrespondentUid, setCurrentCorrespondentUid] = useState(null);

	useEffect(() => { setCurrentCorrespondentUid(null) }, []);

	return (
		<>
			<Navigation menu="Chat" />
			<main>
				<div className={styles.Correspondents}>
					<Correspondents setCurrentCorrespondentUid={ setCurrentCorrespondentUid } />
				</div>
				<div className={styles.ChatBox}>
					<ChatBox correspondentUid={ currentCorrespondentUid } />
				</div>
			</main>
		</>
	);
}