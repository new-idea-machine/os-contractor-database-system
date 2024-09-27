import React, { useContext, useEffect, useState, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	collection,
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

	return (
		<favouritesContext.Provider value={ { favourites } }>
			{children}
		</favouritesContext.Provider>
	);
};

export default FavouritesContext;
