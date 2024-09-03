import React, { useContext, useEffect, useState, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	collection,
	deleteField,
	doc,
	getDoc,
	getDocs,
	limit,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { authContext } from './Authorization';

export const userProfileContext = createContext(null);

function UserProfileContext({ children }) {
	const { user } = useContext(authContext);
	const [userProfile, setUserProfile] = useState([]);

	async function updateUserProfile(data) {
		console.log('TRYING TO UPDATE', data);
		const userDocRef = doc(db, userProfile?.userType, userProfile?.id);
		console.log('userDocRef->', userDocRef);
		const userDocSnapshot = await getDoc(userDocRef);
		if (userDocSnapshot.exists()) {
  			// Update the document
  			await updateDoc(userDocRef, data);
  			console.log('User successfully updated!');
			toast.info(`The changes successfully saved`);
			setUserProfile(data);
		} else {
  			console.log('Document not found');
		}
	};

	useEffect(() => {
		async function fetchUserProfiles(collectionName) {
			const q = query(collection(db, collectionName), where('firebaseUID', '==', user.uid), limit(1));
			const snapshot = await getDocs(q);

			if (!snapshot.empty) {
				const doc = snapshot.docs[0];
				const newProfile = { id: doc.id, ...doc.data() }

				if (newProfile.deleteBy) {
					newProfile.deleteBy = deleteField();

					await updateDoc(doc.ref, newProfile);
					delete newProfile.deleteBy;
					toast.info('Account reactivated');
				}

				setUserProfile(newProfile);
			}
		}

		if (user) {
			// The user profile will be in ONE and ONLY ONE of these collections.

			fetchUserProfiles('recruiter');
			fetchUserProfiles('techs');
		} else{
			setUserProfile(null);
		}
	}, [user]);

	return (
		<userProfileContext.Provider value={ { userProfile, updateUserProfile } }>
			{children}
		</userProfileContext.Provider>
	);
};

export default UserProfileContext;
