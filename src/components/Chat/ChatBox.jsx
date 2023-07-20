import React, { useEffect, useRef, useState, useContext } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  where,
  
} from "firebase/firestore";
import { db } from "../../firebaseconfig";
import Message from "./Message";
import SendMessage from "./SendMessage";
import Navigation from "../navigation/Navigation";
import "./Chat.css";
import { authContext } from '../../contexts/auth';
import { useParams } from "react-router-dom";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  const { user } = useContext(authContext);
  const userUid = user?.uid;
  const { uid } = useParams();


  useEffect(() => {
    const q = query(
        collection(db, "messages"),
        where("uid", "in", [userUid, uid]),
        where("receiverUid", "in", [userUid, uid]),
        orderBy("createdAt", "desc"),
        limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe;
  }, []);

  return (
    
    <main className="chat-box">
        <Navigation />
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} profileUid={uid} />
    </main>
  );
};

export default ChatBox;