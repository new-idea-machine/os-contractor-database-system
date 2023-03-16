import React, { useState, useEffect, createContext, useContext } from 'react';
import { store, auth, db, fbFunctions } from '../firebaseconfig';
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
} from 'firebase/firestore';
import { authContext } from './auth';
import { toast } from 'react-toastify';

export const contractorContext = createContext();

const ContractorContext = ({ children }) => {
	const { user } = useContext(authContext);
	const [contractorList, setContractorList] = useState([]);
	const [contractor, setContractor] = useState(null);

	const [currentUserProfile, setCurrentUserProfile] = useState(null);
	const contractorMap = {};

	const matchProfileToCurrentUser = () => {
		contractorList?.forEach((tech) => {
			contractorMap[tech.firebaseUID] = tech;
		});
		if (user && contractorMap[user?.uid]) {
			const matchedProfile = contractorMap[user?.uid];
			setCurrentUserProfile(matchedProfile);
			// toast.info(`Update your profile ${user?.displayName}!`);
		}
	};
	const getCollection = async () => {
		const querySnapshot = await getDocs(collection(db, 'techs'));
		const documents = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		setContractorList(documents);
	};

	useEffect(() => {
		getCollection();
		if (!currentUserProfile) {
			matchProfileToCurrentUser();
		}
		// const unsubscribe = onSnapshot(collection(db, 'techs'), (snapshot) => {
		// 	const documents = snapshot.docs.map((doc) => ({
		// 		id: doc.id,
		// 		...doc.data(),
		// 	}));
		// 	setContractorList(documents);
		// });
		// // Stop listening for updates when the component unmounts
		// return () => {
		// 	unsubscribe();
		// };
	}, [user, contractorMap]);

	const updateTechObject = async (data) => {
		console.log('TRYING TO UPDATE');
		const userDocRef = doc(db, 'techs', data?.id);
		if (userDocRef) {
			await updateDoc(userDocRef, data);
			console.log('User successfully updated!');
		} else {
			console.log('object not found');
		}
	};

	const appStates = {
		contractorList,
		setContractorList,
		setContractor,
		contractor,
		updateTechObject,
		currentUserProfile,
		setCurrentUserProfile,
	};

	return (
		<contractorContext.Provider value={appStates}>
			{children}
		</contractorContext.Provider>
	);
};

export default ContractorContext;
