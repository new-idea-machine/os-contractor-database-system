import React, { useContext, useEffect, useState, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	collection,
	getDocs,
	limit,
	query,
	where,
} from 'firebase/firestore';
import { authContext } from './Authorization';

export const userProfileContext = createContext(null);

function UserProfileContext({ children }) {
	const { user } = useContext(authContext);
	const [userProfile, setUserProfile] = useState([]);

	useEffect(() => {
		async function fetchUserProfiles(collectionName) {
			const q = query(collection(db, collectionName), where('firebaseUID', '==', user.uid), limit(1));
			const snapshot = await getDocs(q);

			if (!snapshot.empty) {
				const doc = snapshot.docs[0];

				setUserProfile({ id: doc.id, ...doc.data() });
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
		<userProfileContext.Provider value={ { userProfile } }>
			{children}
		</userProfileContext.Provider>
	);
};

export default UserProfileContext;
