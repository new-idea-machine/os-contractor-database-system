import React, { useState, useEffect, createContext, useContext } from 'react';
import { db} from '../firebaseconfig';
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
	//   orderBy,
} from 'firebase/firestore';
import { authContext } from './auth';
import { toast } from 'react-toastify';

export const recruiterContext = createContext();

const RecruiterContext = ({ children }) => {
	const { user } = useContext(authContext);
	const [recruiterList, setRecruiterList] = useState([]);
	const [recruiter, setRecruiter] = useState(null);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);


	// const matchProfileToCurrentUser = () => {
	//   contractorList?.map((userUID) => {
	//     if (userUID?.firebaseUID === user?.uid) setCurrentUserProfile(userUID);
	//   });
	// };
	const recruiterMap = {};


    const matchProfileToCurrentUser = () => {
		recruiterList?.forEach((rec) => {
			recruiterMap[rec.firebaseUID] = rec;
           
		});
		if (user && recruiterMap[user?.uid]) {
			const matchedProfile = recruiterMap[user?.uid];
			setCurrentUserProfile(matchedProfile);
            
            console.log('MATCHED PROG-> ',matchedProfile);
		}
        
       
	};
	const updateRecObject = async (data) => {
		console.log('TRYING TO UPDATE', data);
		const userDocRef = doc(db, 'recruiter', data?.id);
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

	const getFavoriteList = async () => {
		
		try {
			if (user) {
			  const userFirebaseUID = user.uid;
			  const recruitersQuery = query(
				collection(db, 'recruiter'),
				where('firebaseUID', '==', userFirebaseUID)
			  );
			  const recruiterQuerySnapshot = await getDocs(recruitersQuery);
		
			  if (!recruiterQuerySnapshot.empty) {
				const recruiterData = recruiterQuerySnapshot.docs[0].data();
				const favorites = recruiterData?.favorites || [];
				return favorites;
			  }
			}
			return [];
		  } catch (error) {
			console.error('Error fetching favorites:', error);
			return [];
		  }
		};

		//setting recruiters list 
    useEffect(() => {
		const unsubscribe = onSnapshot(collection(db, 'recruiter'), (snapshot) => {
			const documents = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setRecruiterList(documents);
            matchProfileToCurrentUser();
		});
		return () => {
			unsubscribe();
		};
	}, []);

	const appStates = {
		recruiterList,
		setRecruiterList,
		setRecruiter,
		recruiter,
		updateRecObject,
		currentUserProfile,
		setCurrentUserProfile,
		matchProfileToCurrentUser,
		recruiterMap,
		getFavoriteList
	};

	return (
		<recruiterContext.Provider value={appStates}>
			{children}
		</recruiterContext.Provider>
	);
};

export default RecruiterContext;
