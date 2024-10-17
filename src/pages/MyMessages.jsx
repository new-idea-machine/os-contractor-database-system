import React, { useState } from 'react';
import { Navigation } from '../components';
import ChatBox from '../components/Chat/ChatBox';
import Correspondents from '../components/Chat/Correspondents';

import '../components/Chat/Chat.css';

export default function MyMessages() {
	const [currentChat, setCurrentChat] = useState(null);

	return (
		<>
			<Navigation menu="Chat" />
			<main>
				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
					<Correspondents setCurrentChat={ setCurrentChat } />
					<ChatBox chat={ currentChat } />
				</div>
			</main>
		</>
	);
}