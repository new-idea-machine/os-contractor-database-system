import React, { useContext } from 'react';
import { Navigation } from '../components';
import {messagesContext} from '../contexts/MessagesContext';
import { Link } from 'react-router-dom';
import ProfilePicture from '../components/ProfilePicture';

export default function MyMessages() {
	const { chatsList } = useContext(messagesContext);

	return (
		<>
			<Navigation />
			<main>
				<h1>Messages</h1>

				<ul>
					{chatsList?.map((message, index) => (
						<li key={index} className="message-container">
							<Link to={`/chat/${message.uid}`}>
								<ProfilePicture profileImage={message.avatar} size="40px" />
							</Link>
							<span className="message-name">{message.name}({message.newMessageCount})</span>
						</li>
					))}
				</ul>
			</main>
		</>
	);
}