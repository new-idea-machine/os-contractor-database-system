import React from "react";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";

import styles from "./Message.module.css";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);

  const createdAt = new Timestamp(message.createdAt.seconds, message.createdAt.nanoseconds);

  return (
    <article className={message.uid === user.uid ? styles.Receiver : styles.Sender}>
      <div>{message.text}</div>
      <div>{createdAt.toDate().toLocaleTimeString()}</div>
      <div>[Buttons]</div>
    </article>
  );
};

export default Message;