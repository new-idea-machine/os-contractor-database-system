import React from "react";
import { auth } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import Avatar from '@mui/material/Avatar';

const Message = ({ message }) => {
  const [user] = useAuthState(auth);

  if (!message)
    console.log("message:", message);

  if (message) {
    return (
      <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
        {message?.avatar? (
        <img
          className="chat-bubble__left"
          src={message.avatar}
          alt="user avatar"
        />) : (<Avatar

          alt="Avatar"
          key={message.id}
          className="chat-bubble__left"
          />)}
        <div className="chat-bubble__right">
          <p className="user-name">{message.name}</p>
          <p className="user-message">{message.text}</p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Message;