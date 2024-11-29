import React, { useRef, useEffect, useContext } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import "./Chat.css";
import { messagesContext } from '../../contexts/MessagesContext';

const ChatBox = ({ correspondentUid }) => {
  const scroll = useRef();
	const { chatsList, getNumUnreadMessages, updateHasRead } = useContext(messagesContext);
	const numUnreadMessages = getNumUnreadMessages();
  const chat = chatsList.find((chat) => chat.uid === correspondentUid);

  updateHasRead(chat);

  useEffect(() => {
    if (scroll.current)
      scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [correspondentUid, chatsList]);

  return (chat ?
      <>
        <div>
          {chat.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </div>
        {/* when a new message enters the chat, the screen scrolls down to this element */}
        <span ref={scroll}></span>
        <SendMessage receiverUid={correspondentUid} />
      </>:
      <>
        You have {numUnreadMessages} unread message{numUnreadMessages === 1 ? "" : "s"}.
      </>
    );
};

export default ChatBox;