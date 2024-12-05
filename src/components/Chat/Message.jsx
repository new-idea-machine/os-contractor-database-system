import React from "react";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";

import { ReactComponent as IconArchive } from "../../assets/icons/archiveChat.svg";
import { ReactComponent as IconStar } from "../../assets/icons/starChat.svg";
import { ReactComponent as IconTrash } from "../../assets/icons/trashChat.svg";

import styles from "./Message.module.css";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);

  const createdAt = new Timestamp(message.createdAt.seconds, message.createdAt.nanoseconds);

  return (
    <article className={message.uid === user.uid ? styles.Receiver : styles.Sender}>
      <div>{message.text}</div>
      <div>{createdAt.toDate().toLocaleTimeString()}</div>
      <div><IconArchive /> <IconStar /> <IconTrash /></div>
    </article>
  );
};

export default Message;