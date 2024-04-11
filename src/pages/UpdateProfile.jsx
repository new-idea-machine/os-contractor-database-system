import React, { useContext, useEffect, useState  } from "react";
import { Navigation } from '../components';
import ProfileForm from '../components/profileForm/ProfileForm';
import RecruiterProfileForm from '../components/profileForm/RecruiterProfileForm';
import { authContext } from '../contexts/Authorization';
import { collection, getDocs, doc, getDoc, query, where, limit} from 'firebase/firestore';
import { store, auth, db, fbFunctions } from '../firebaseconfig';


async function getPath(uid) {
	let path = null;
	try {
		const  techsQuery = query(collection(db, 'techs'), where('firebaseUID', '==', uid));
		const recruiterQuery = query(collection(db, 'recruiter'), where('firebaseUID', '==', uid));

		const [techsSnapshot, recruiterSnapshot] = await Promise.all([getDocs(techsQuery), getDocs(recruiterQuery)]);



		if (!techsSnapshot.empty) {
		  path = <ProfileForm />;
		} else if (!recruiterSnapshot.empty) {
		  path = <RecruiterProfileForm/>;
		} else {
		  console.log('No records found');
		}
	  } catch (error) {
		console.error('Error retrieving user document:', error);

	  }


	  return path;
	}



export default function UpdateProfile() {

	const { user } = useContext(authContext);
	const [userPath, setUserPath] = useState(null);

	useEffect(() => {
		const fetchUserPath = async (uid) => {
		  try {
			const path = await getPath(uid);
			setUserPath(path);
		  } catch (error) {
			console.error('Error fetching user path:', error);
			setUserPath(null);
		  }
		};

		const uid = user?.uid;

    if (uid) {
      fetchUserPath(uid);
    }
  }, [user]);


	return (
		<>
			<Navigation />
			<main>
				{userPath}
			</main>
		</>
	);
}
