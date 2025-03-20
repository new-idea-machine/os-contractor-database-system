import React, { useRef, useEffect, useContext } from "react";
import { messagesContext } from '../../contexts/MessagesContext';
import ProfilePicture from '../ProfilePicture';
import Message from "./Message";
import SendMessage from "./SendMessage";

import styles from "./ChatBox.module.css";

const ChatBox = ({ chatsList, correspondentUid }) => {
  const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: "full" });
  const scroll = useRef();
  const { getNumUnreadMessages, updateHasRead } = useContext(messagesContext);
  const numUnreadMessages = getNumUnreadMessages();
  const chat = chatsList.find((chat) => chat.uid === correspondentUid);
  const messageGroups = [];

  useEffect(() => {
    if (scroll.current)
      scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [correspondentUid, chatsList]);

  if (chat) {
    updateHasRead(chat);

    chat.messages.forEach(message => {
      const messageDateString = dateFormatter.format(message.createdAt.toDate());

      if ((messageGroups.length === 0) || (messageGroups[messageGroups.length - 1].date !== messageDateString))
        messageGroups.push({ date: messageDateString, messages: []});

      messageGroups[messageGroups.length - 1].messages.push(message);
    })
  }

  return (chat ?
    <>
      <div className={styles.Header}>
        <ProfilePicture profileImage={chat.avatar} size="80px" />
        <div>
          <span>{chat.firstName}{" "}{chat.lastName}</span><br />
          <span>{chat.qualification}</span>
        </div>
      </div>
      <div className={styles.MessageList}>
        {messageGroups.map((group) => (
          <section key={group.date}>
            <p className="splitBar">{group.date}</p>
            {group.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </section>
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to this element */}
      <span ref={scroll}></span>
      <div className={styles.Footer}>
        <SendMessage receiverUid={correspondentUid} />
      </div>
    </>:
    <div className={styles.NoSelection}>
      You have {numUnreadMessages} unread message{numUnreadMessages === 1 ? "" : "s"}
    </div>
  );
};

export default ChatBox;