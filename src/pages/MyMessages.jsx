import React, { useContext, useRef, useState } from 'react';
import {messagesContext} from '../contexts/MessagesContext';
import { Navigation } from '../components';
import Message from '../components/Chat/Message';
import SendMessage from '../components/Chat/Message';
import ProfilePicture from '../components/ProfilePicture';

import '../components/Chat/Chat.css';

export default function MyMessages() {
	const { chatsList } = useContext(messagesContext);
	const [currentCorrespondent, setCurrentCorrespondent] = useState(null);
	const currentChat = chatsList.find((chat) => chat.uid === currentCorrespondent?.uid);
	const scroll = useRef();

	console.log('currentChat:', currentChat);

	return (
		<>
			<Navigation menu="Chat" />
			<main>
				<h1>Messages</h1>

				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
					<ul>
						{chatsList?.map((correspondent) => (
							<li key={correspondent.uid} className="message-container">
								<button onClick={() => setCurrentCorrespondent(correspondent)}>
									<ProfilePicture profileImage={correspondent.avatar} size="40px" />
									<span className="message-name">
										{correspondent.firstName}{" "}
										{correspondent.lastName}
									</span>
									<span>({correspondent.newMessageCount})</span><br />
									<span>{correspondent.qualification}</span>
								</button>
							</li>
						))}
					</ul>
					{
						currentCorrespondent ?
						<>
							<div className="messages-wrapper">
								{currentChat.messages.map((message, index) => {
									return (<Message key={`${message.uid} - ${index}`} message={message} />);
								})}
							</div>
							<span ref={scroll}></span>
							<SendMessage scroll={scroll} profileUid={currentCorrespondent.uid} />
							</>:
						<div>
							You have messages (maybe).
						</div>
					}
				</div>
			</main>
		</>
	);
}