import React, { useContext } from "react";
import { messagesContext } from '../../contexts/MessagesContext';

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
    <form onSubmit={send} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        defaultValue=""
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;