import React, { useState, useContext,  useEffect } from "react";
import { auth, db } from "../../firebaseconfig";
import { addDoc, collection, serverTimestamp, query, where, getDoc, doc } from "firebase/firestore";
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';
import { recruiterContext } from "../../contexts/RecruiterContext";

const SendMessage = ({ scroll }) => {
  const [message, setMessage] = useState("");
  const { user } = useContext(authContext);
  const userUid = user?.uid;
  const { contractorList } = useContext(contractorContext);
  const { recruiterList } = useContext(recruiterContext);
  console.log("User: ", userUid );
  const [userData, setUserData] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {

        contractorList.map((contractor) => {
            if (userUid === contractor?.firebaseUID) {
                setUserData(contractor);   
            }
            else {
                recruiterList.map((recruiter) => {
                    if(userUid === recruiter?.firebaseUID){
                        setUserData(recruiter);
                    }
                })
            }
        });
       

    };
    fetchUserData();

  }, [user]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    
    await addDoc(collection(db, "messages"), {
      text: message,
      name: userData?.firstName,
      email: userData?.email,
      avatar: userData?.profileImg || user?.photoURL,
      createdAt: serverTimestamp(),
      uid: userData?.firebaseUID,
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