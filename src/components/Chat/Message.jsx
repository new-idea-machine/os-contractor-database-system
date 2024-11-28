import React from "react";
import { Timestamp } from "firebase/firestore";
import { auth } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);

  if (message) {
    const createdAt = new Timestamp(message.createdAt.seconds, message.createdAt.nanoseconds);

    return (
      <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
        <p>{message.text}</p>
        <p>{createdAt.toDate().toLocaleTimeString()}</p>
      </div>
    );
  } else {
    return <></>;
  }
};

export default Message;