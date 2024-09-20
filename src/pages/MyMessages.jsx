import React, { useContext } from 'react';
import { Navigation } from '../components';
import {messagesContext} from '../contexts/MessagesContext';
import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';

export default function MyMessages() {
	const { chatsList } = useContext(messagesContext);

	return (
		<>
			<Navigation menu="Chat" />
			<main>
				<h1>Messages</h1>

				<div style={{display: "grid", gridTemplateColumns: "1fr 1fr"}}>
					<ul>
						{chatsList?.map((message) => (
							<li key={message.uid} className="message-container">
								<Link to={`/chat/${message.uid}`}>
									<ProfilePicture profileImage={message.avatar} size="40px" />
									<span className="message-name">{message.name} ({message.newMessageCount})</span>
								</Link>
							</li>
						))}
					</ul>
					<div>
						You have messages (maybe).
					</div>
				</div>
			</main>
		</>
	);
}