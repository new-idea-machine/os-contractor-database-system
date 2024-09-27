import React, { useState, useContext } from "react";
import { db } from "../../firebaseconfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { authContext } from '../../contexts/Authorization';
import { userProfileContext } from "../../contexts/UserProfileContext";

const SendMessage = ({ scroll, profileUid }) => {
  const [message, setMessage] = useState("");
  const { user } = useContext(authContext);
  const userProfile = useContext(userProfileContext);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      return;
    }

    await addDoc(collection(db, "messages"), {
      text: message.trim(),
      name: userProfile?.firstName,
      email: userProfile?.email,
      avatar: userProfile?.profileImg || user?.photoURL,
      createdAt: serverTimestamp(),
      uid: userProfile?.firebaseUID,
      receiverUid: profileUid,
      hasRead: false,
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;