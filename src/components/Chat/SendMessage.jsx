import React, { useContext } from "react";
import { messagesContext } from '../../contexts/MessagesContext';

import styles from "./SendMessage.module.css";

import { ReactComponent as IconSend } from "../../assets/icons/sendMessage.svg";


const SendMessage = ({ receiverUid }) => {
  const { sendMessage } = useContext(messagesContext);

  const send = (event) => {
    const messageField = event.target.elements["messageInput"];

    event.preventDefault();
    sendMessage(receiverUid, messageField.value);

    messageField.value = "";

    // scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form className={styles.SendMessage} onSubmit={send}>
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        placeholder="Type message"
        defaultValue=""
      />
      <button type="submit"><IconSend /></button>
    </form>
  );
};

export default SendMessage;