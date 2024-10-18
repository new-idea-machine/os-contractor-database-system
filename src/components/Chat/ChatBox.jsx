import React, { useRef, useContext } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import "./Chat.css";
import { messagesContext } from '../../contexts/MessagesContext';

const ChatBox = ({ chat }) => {
  const scroll = useRef();
	const { getNumUnreadMessages, updateHasRead } = useContext(messagesContext);
	const numUnreadMessages = getNumUnreadMessages();

	updateHasRead(chat);

  return (chat ?
      <div>
        <div className="messages-wrapper">
          {chat.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
        <span ref={scroll}></span>
        <SendMessage receiverUid={chat.uid} />
      </div>:
      <div>
        You have {numUnreadMessages} unread message{numUnreadMessages === 1 ? "" : "s"}.
      </div>
    );
};

export default ChatBox;