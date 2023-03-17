import React, { useState, useEffect, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	doc,
	// addDoc,
	//   getDoc,
	// onSnapshot,
	// setDoc,
	// serverTimestamp,
	updateDoc,
	collection,
	//   query,
	getDocs,
	//   where,
	//   orderBy,
} from 'firebase/firestore';

export const skillsContext = createContext();

const SkillsContext = ({ children }) => {
	const [skillsList, setSkillsList] = useState([]);

	const getCollection = async () => {
		const querySnapshot = await getDocs(collection(db, 'skills'));
		const documents = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		setSkillsList(documents);
	};
	useEffect(() => {
		getCollection();
	}, []);

	const updateTechObject = async (data) => {
		console.log('TRYING TO UPDATE');
		const userDocRef = doc(db, 'skills', data?.id);
		if (userDocRef) {
			await updateDoc(userDocRef, data);
			console.log('User successfully updated!');
		} else {
			console.log('object not found');
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
