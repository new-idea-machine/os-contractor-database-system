import React, { useContext, useEffect, useState, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	query,
	updateDoc
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { authContext } from './Authorization';

export const userProfileContext = createContext();

function UserProfileContext({ children }) {
	const { user } = useContext(authContext);
	const [contractors, setContractors] = useState([]);
	const [recruiters, setRecruiters] = useState([]);
	const [contractorsUnsubscribe, setContractorsUnsubscribe] = useState(null);
	const [recruitersUnsubscribe, setRecruitersUnsubscribe] = useState(null);
	const [userProfile, setUserProfile] = useState([]);

	async function updateUserProfile(data) {
		const userDocRef = doc(db, userProfile?.userType, userProfile?.id);
		const userDocSnapshot = await getDoc(userDocRef);
		if (userDocSnapshot.exists()) {
  			// Update the document
  			await updateDoc(userDocRef, data);
			toast.info(`The changes successfully saved`);
		} else {
  			console.log('Document not found');
		}
	};

	useEffect(() => {
		const fetchUsers = (collectionName, setUsers, setUnsubscribe) => {
			const usersQuery = query(collection(db, collectionName));

			setUnsubscribe(() => onSnapshot(usersQuery,
				(snapshot) => {
					setUsers(snapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					})));
				},
				(error) => {console.error(`Error fetching users from "${collection}":`, error);})
			);
		}

		if (contractorsUnsubscribe) {
			contractorsUnsubscribe();
		}

		if (recruitersUnsubscribe) {
			recruitersUnsubscribe();
		}

		if (user) {
			fetchUsers('techs', setContractors, setContractorsUnsubscribe);
			fetchUsers('recruiter', setRecruiters, setRecruitersUnsubscribe);
		} else {
			setContractors([]);
			setRecruiters([]);
			setContractorsUnsubscribe(null);
			setRecruitersUnsubscribe(null);
		}
	}, [user]);

	useEffect(() => {
		function finder(element) {
			return element.firebaseUID === user.uid;
		}

		if (user?.uid) {
			// The current user's profile will be in ONE and ONLY ONE of these collections.

			setUserProfile(contractors.find(finder) || recruiters.find(finder));
		} else {
			setUserProfile(null);
		}
	}, [contractors, recruiters]);

	function getUserProfile(uid) {
		function finder(element) {
			return element.firebaseUID === uid;
		}

		if (uid)
			// The requested user's profile will be in ONE and ONLY ONE of these collections.

			return contractors.find(finder) || recruiters.find(finder);
		else
			return userProfile;
	}

	return (
		<userProfileContext.Provider value={ { userProfile, contractors, recruiters, getUserProfile, updateUserProfile } }>
			{children}
		</userProfileContext.Provider>
	);
};

export default UserProfileContext;
