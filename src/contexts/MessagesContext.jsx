import React, { useState, useEffect, createContext, useContext } from 'react';
import { store, auth, db, fbFunctions } from '../firebaseconfig';
import {
	doc,
	addDoc,
	 getDoc,
	onSnapshot,
	setDoc,
	serverTimestamp,
	updateDoc,
	collection,
	   query,
	getDocs,
	   where,
	   orderBy,
} from 'firebase/firestore';
import { authContext } from './Authorization';
import { contractorContext } from './ContractorContext';
import { recruiterContext } from "./RecruiterContext";


export const messagesContext = createContext();

const MessagesContext = ({ children }) => {
	const { user } = useContext(authContext);
	const [chatsList, setChatsList] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);

    const removeDuplicates = (array, key) => {
        const seen = new Set();
        return array.filter((item) => {
          const value = item[key];
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
          return true;
        });
      };

    const getUserChats = async () => {
        if (user && user.uid) {
            const q = query(
              collection(db, 'messages'),
              where('receiverUid', '==', user.uid)
            );


            try {
                const querySnapshot = await getDocs(q);

                const fetchedMessages = querySnapshot.docs.map((doc) => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                console.log('docs : ', fetchedMessages);
                const uniqueFetchedMessages = removeDuplicates(fetchedMessages, 'uid');
                 // Fetch newMessageCount for each unique uid in uniqueFetchedMessages
                const updatedMessages = await Promise.all(
                uniqueFetchedMessages.map(async (message) => {
                const { uid } = message;

                const q = query(
                collection(db, 'messages'),
                where('uid', '==', uid),
                where('hasRead', '==', 'false')
          );

          const querySnapshot = await getDocs(q);
          const newMessageCount = querySnapshot.size;

          return {
            ...message,
            newMessageCount,
          };
        })
      );

      console.log('unique docs with newMessageCount: ', updatedMessages);

      setChatsList(updatedMessages);
              } catch (error) {
                console.error('Error fetching messages:', error);
                setChatsList([]); // Return an empty array if there's an error

              }
            }

      };

      const getUnreadMessages = () => {
        const totalUnreadMessages = chatsList.reduce((acc, message) => {
          return acc + message.newMessageCount;
        }, 0);
        return totalUnreadMessages;
      };


	useEffect(() => {
		if (user && user.uid) {
            getUserChats();
            getUnreadMessages();
          }
        }, [user]);



	const appStates = {
		setChatsList,
        chatsList,
        getUserChats,
        unreadMessages: getUnreadMessages()
	};

	return (
		<messagesContext.Provider value={appStates}>
			{children}
		</messagesContext.Provider>
	);
};

export default MessagesContext;