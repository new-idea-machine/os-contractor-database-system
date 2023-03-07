import React, { useState, useEffect, createContext } from 'react';
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

export const contractorContext = createContext();

const ContractorContext = ({ children }) => {
	const [contractorList, setContractorList] = useState([]);
	const [contractor, setContractor] = useState(null);

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
		const unsubscribe = onSnapshot(collection(db, 'techs'), (snapshot) => {
			const documents = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setContractorList(documents);
		});
		// Stop listening for updates when the component unmounts
		return () => {
			unsubscribe();
		};
	}, []);

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
	};

	return (
		<contractorContext.Provider value={appStates}>
			{children}
		</contractorContext.Provider>
	);
};

export default ContractorContext;
