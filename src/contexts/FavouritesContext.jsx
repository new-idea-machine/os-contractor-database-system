import React, { useContext, useEffect, useState, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	addDoc,
	collection,
	deleteDoc,
	getDocs,
	onSnapshot,
	query,
	where
} from 'firebase/firestore';
import { userProfileContext } from './UserProfileContext';

export const favouritesContext = createContext(null);

function FavouritesContext({ children }) {
	const { userProfile } = useContext(userProfileContext);
	const [favourites, setFavourites] = useState([]);
	const [unsubscribe, setUnsubscribe] = useState(null);

	useEffect(() => {
		if (unsubscribe) {
			unsubscribe();
		}

		if (userProfile?.userType === "recruiter") {
			const usersQuery = query(collection(db, "favs"),
				where("recruiterId", "==", userProfile.firebaseUID));

			setUnsubscribe(() => onSnapshot(usersQuery,
				(snapshot) => {
					setFavourites(snapshot.docs.map((doc) => (doc.data().techId)));
				},
				(error) => {console.error("Error fetching favourites:", error);})
			);
		} else {
			setFavourites([]);
			setUnsubscribe(null);
		}
	}, [userProfile]);

	async function addFavourite(uid) {
		if (!isAFavourite(uid)) {
			const data = {
				techId: uid,
				recruiterId: userProfile.firebaseUID,
			};

			await addDoc(collection(db, "favs"), data);
		}
	}

	async function deleteFavourite(uid) {
		const connectionsQuery = query(collection(db, "favs"),
			where("techId", "==", uid),
			where("recruiterId", "==", userProfile.firebaseUID));
		const connectionsSnapshot = await getDocs(connectionsQuery);

		connectionsSnapshot.forEach(async (connection) => await deleteDoc(connection.ref));
	}

	function isAFavourite(uid) {
		return (favourites.findIndex((techId) => techId === uid) !== -1)
	}

	return (
		<favouritesContext.Provider value={ { favourites, addFavourite, deleteFavourite, isAFavourite } }>
			{children}
		</favouritesContext.Provider>
	);
};

export default FavouritesContext;
