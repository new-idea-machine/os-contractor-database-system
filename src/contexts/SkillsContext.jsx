import React, { useState, useEffect, createContext } from "react";
import { store, auth, db, fbFunctions } from "../firebaseconfig";
import {
  doc,
  addDoc,
  //   getDoc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  updateDoc,
  collection,
  //   query,
  getDocs,
  //   where,
  //   orderBy,
} from "firebase/firestore";

export const skillsContext = createContext();

const SkillsContext = ({ children }) => {
  const [skillsList, setSkillsList] = useState([]);
  // console.log("skillsList in context", skillsList)

  // const getCollection = async () => {
  // 	const querySnapshot = await getDocs(collection(db, 'techs'));
  // 	const documents = querySnapshot.docs.map((doc) => ({
  // 		id: doc.id,
  // 		...doc.data(),
  // 	}));
  // 	setContractorList(documents);
  // };
  useEffect(() => {
    // getCollection();
    const unsubscribe = onSnapshot(collection(db, "skills"), (snapshot) => {
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      documents.sort((a, b) => (a.title > b.title ? 1 : -1));
      setSkillsList(documents);
    });
    // Stop listening for updates when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  const updateTechObject = async (data) => {
    console.log("TRYING TO UPDATE");
    const userDocRef = doc(db, "skills", data?.id);
    if (userDocRef) {
      await updateDoc(userDocRef, data);
      console.log("User successfully updated!");
    } else {
      console.log("object not found");
    }
  };

  const appStates = {
    skillsList,
    setSkillsList,
    updateTechObject,
  };

  return (
    <skillsContext.Provider value={appStates}>
      {children}
    </skillsContext.Provider>
  );
};

export default SkillsContext;
