import React, { useContext } from 'react';
import { messagesContext } from '../../contexts/MessagesContext';
import ProfilePicture from '../ProfilePicture';

function Correspondents({ setCurrentCorrespondentUid }) {
	const { chatsList } = useContext(messagesContext);

	return (
		<>
			<h1>Chats</h1>

			<ul>
				{chatsList?.map((chat) => (
					<li key={chat.uid} className="message-container">
						{/* <div>
							<Link to={`/chat/${chat.uid}`}>
								<ProfilePicture profileImage={chat.avatar} size="40px" />
								<span className="message-name">{chat.name}({chat.newMessageCount})</span>
								<span>{chat.newMessageCount}</span>
							</Link>
						</div> */}

						<button onClick={() => setCurrentCorrespondentUid(chat.uid)}>
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

		</>
	)
}

export default Correspondents;