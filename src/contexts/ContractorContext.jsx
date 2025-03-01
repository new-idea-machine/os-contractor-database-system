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
	//   query,
	getDocs,
	//   where,
	//   orderBy,
} from 'firebase/firestore';
import { authContext } from './Authorization';
import { contractorsContext } from './ContractorsContext'
import { toast } from 'react-toastify';

export const contractorContext = createContext();

const ContractorContext = ({ children }) => {
	const { user } = useContext(authContext);
	const contractorList = useContext(contractorsContext);
	const [contractor, setContractor] = useState(null);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);


	// const matchProfileToCurrentUser = () => {
	//   contractorList?.map((userUID) => {
	//     if (userUID?.firebaseUID === user?.uid) setCurrentUserProfile(userUID);
	//   });
	// };
	const contractorMap = {};
	const matchProfileToCurrentUser = () => {
		contractorList?.forEach((tech) => {
			contractorMap[tech.firebaseUID] = tech;
		});
		if (user && contractorMap[user?.uid]) {
			const matchedProfile = contractorMap[user?.uid];
			setCurrentUserProfile(matchedProfile);
		}
	};
	const updateTechObject = async (data, callback) => {
		console.log('TRYING TO UPDATE', data);
		const userDocRef = doc(db, 'techs', data?.id);
		console.log('userDocRef->', userDocRef);
		const userDocSnapshot = await getDoc(userDocRef);
		if (userDocSnapshot.exists()) {
  			// Update the document
  			await updateDoc(userDocRef, data);
  			console.log('User successfully updated!');
			  toast.info(`The changes successfully saved`);
			  matchProfileToCurrentUser();
		} else {
  			console.log('Document not found');
		}
	};

	const appStates = {
		setContractor,
		contractor,
		updateTechObject,
		currentUserProfile,
		setCurrentUserProfile,
		matchProfileToCurrentUser,
		contractorMap,
	};

	return (
		<contractorContext.Provider value={appStates}>
			{children}
		</contractorContext.Provider>
	);
};

export default ContractorContext;
