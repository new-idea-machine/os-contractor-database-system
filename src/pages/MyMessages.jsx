import React, { useContext, useEffect, useState } from 'react';
import { Footer, Navigation } from '../components';
import {messagesContext} from '../contexts/MessagesContext';
import { Link } from 'react-router-dom'; 
//import Avatar from "./../assets/avatar.png";
//import { Avatar } from '@mui/joy';
//import "..components/Chat/Chat.css";
import Avatar from '@mui/material/Avatar';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseconfig";

export default function MyMessages() {
	const { chatsList } = useContext(messagesContext);
    const [user] = useAuthState(auth);
    

  
	
	return (
		<>
        
			<Navigation />

            <div className='messagesListPage'>
				<h1 style={{ textAlign: 'center', color: 'black', margin:'20px' }}>
					
				</h1>

				<ul className='listContainer'>
					{chatsList.length > 0 &&
						chatsList?.map((message) => (
							<li key={message.id} className="message-container">
								<Link to={`/chat/${message.uid}`}>
                                    {message?.avatar? (
									<img
										key={message.id}
										className="chat-bubble__left"
										src={message.avatar}
										alt="user avatar"
										width="100"
										height="100"
									/>):(<Avatar
                                            
                                            alt="Avatar"
                                            key={message.id}
										    className="chat-bubble__left"
										    width="100"
										    height="100" />)}

								</Link>
								<span className="message-name">{message.name}({message.newMessageCount})</span>
							</li>
						))}
				</ul>
			</div>
		
			<Footer />
		</>
	);
}