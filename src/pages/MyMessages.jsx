import React, { useContext, useRef, useState } from 'react';
import { messagesContext } from '../contexts/MessagesContext';
import { Navigation } from '../components';
import Message from '../components/Chat/Message';
import SendMessage from '../components/Chat/Message';
import ProfilePicture from '../components/ProfilePicture';

import '../components/Chat/Chat.css';

export default function MyMessages() {
	const { chatsList, getNumUnreadMessages, updateHasRead } = useContext(messagesContext);
	const [currentChat, setCurrentChat] = useState(null);
	const numUnreadMessages = getNumUnreadMessages();
	const scroll = useRef();

	updateHasRead(currentChat);

	return (
		<>
			<Navigation menu="Chat" />
			<main>
				<h1>Messages</h1>

				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
					<ul>
						{chatsList?.map((chat) => (
							<li key={chat.uid} className="message-container">
								<button onClick={() => setCurrentChat(chat)}>
									<ProfilePicture profileImage={chat.avatar} size="40px" />
									<span className="message-name">
										{chat.firstName}{" "}
										{chat.lastName}
									</span>
									<span>({chat.newMessageCount})</span><br />
									<span>{chat.qualification}</span>
								</button>
							</li>
						))}
					</ul>
					{
						currentChat ?
						<>
							<div className="messages-wrapper">
								{currentChat.messages.map((message, index) => {
									return (<Message key={`${message.uid} - ${index}`} message={message} />);
								})}
							</div>
							<span ref={scroll}></span>
							<SendMessage scroll={scroll} profileUid={currentChat.uid} />
						</>:
						<div>
							You have {numUnreadMessages} unread message{numUnreadMessages === 1 ? "" : "s"}.
						</div>
					}
				</div>
			</main>
		</>
	);
}