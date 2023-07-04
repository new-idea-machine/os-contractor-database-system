import Chat from "../components/Chats/Chat";
import SendMessage from "../components/Chats/SendMessage";
import React, { useContext } from 'react';

const MyChat = () => {
  return (
    <div>
      <ChatBox />
      <SendMessage />
    </div>
  )
}

export default MyChat;
