import React, { useContext, useEffect, useState, createContext } from 'react';
import { db } from '../firebaseconfig';
import {
	collection,
	onSnapshot,
} from 'firebase/firestore';
import { authContext } from './Authorization';

export const contractorsContext = createContext(null);

function ContractorsContext({ children }) {
	const { user } = useContext(authContext);
	const [contractorList, setContractorList] = useState([]);
	const [unsubscribe, setUnsubscribe] = useState(null);


	useEffect(() => {
		if (user && !unsubscribe) {
			const unsubscriber = onSnapshot(collection(db, 'techs'), (snapshot) => {
				const documents = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setContractorList(documents);
			});

			setUnsubscribe(() => unsubscriber);
		} else if (!user && unsubscribe) {
			unsubscribe();
			setContractorList([]);
			setUnsubscribe(null);
		}
	}, [user, unsubscribe]);

	return (
		<contractorsContext.Provider value={ contractorList }>
			{children}
		</contractorsContext.Provider>
	);
};

export default ContractorsContext;
