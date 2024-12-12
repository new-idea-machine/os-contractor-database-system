import React, { useContext } from "react";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { messagesContext } from '../../contexts/MessagesContext';

import { ReactComponent as IconArchive } from "../../assets/icons/archiveChat.svg";
import { ReactComponent as IconStar } from "../../assets/icons/starChat.svg";
import { ReactComponent as IconTrash } from "../../assets/icons/trashChat.svg";

import styles from "./Message.module.css";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  const { updateMessage } = useContext(messagesContext);

  let archived = null;
  let starred = null;
  let deleted = null;

  if (message.uid === user.uid) {
    archived = message.archived === true;
    starred = message.starred === true;
    deleted = (message.deletedOn);
  }
  else {
    archived = message.receiverArchived === true;
    starred = message.receiverStarred === true;
    deleted = (message.receiverDeletedOn);
  }

  const createdAt = new Timestamp(message.createdAt.seconds, message.createdAt.nanoseconds);

  return (
    <article className={message.uid === user.uid ? styles.Receiver : styles.Sender}>
      <div>{message.text}</div>
      <div>{createdAt.toDate().toLocaleTimeString()}</div>
      <div>
        <IconArchive style={{color: archived ? "red" : "black"}} onClick={() => updateMessage(message, {archive:  !archived})} />
        <IconStar style={{color: starred ? "red" : "black"}} onClick={() => updateMessage(message, {star:  !starred})} />
        <IconTrash style={{color: deleted ? "red" : "black"}} onClick={() => updateMessage(message, {delete:  !deleted})} />
      </div>
    </article>
  );
};

export default Message;