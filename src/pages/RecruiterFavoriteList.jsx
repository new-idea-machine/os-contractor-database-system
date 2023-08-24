import React, { useContext, useEffect, useState} from 'react';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';
import { Footer, Navigation } from '../components';
import { recruiterContext, getFavoriteList } from '../contexts/RecruiterContext';
import { db} from '../firebaseconfig';
import {
	doc,
	 getDoc,
	
} from 'firebase/firestore';


export default function RecruiterFavoriteList() {

    const { getFavoriteList } = useContext(recruiterContext);
	const [favoriteList, setFavoriteList] = useState([]);
	const [favoriteProfiles, setFavoriteProfiles] = useState([]);

	useEffect(() => {
		const fetchFavorites = async () => {
			const favorites = await getFavoriteList();
			setFavoriteList(favorites);
		};
		fetchFavorites();
	}, [getFavoriteList]);

	useEffect(() => {
		const fetchFavoriteProfiles = async () => {
			const profiles = [];
			for (const docId of favoriteList) {
				const profileDocRef = doc(db, 'techs', docId);
				const profileDocSnapshot = await getDoc(profileDocRef);
				if (profileDocSnapshot.exists()) {
					const profileData = profileDocSnapshot.data();
					profiles.push(profileData);
				}
			}
			setFavoriteProfiles(profiles);
		};
		fetchFavoriteProfiles();
	}, [favoriteList]);
	return (
		<>
			<Navigation />
			<div className='contractorListPage'>
				<h1 style={{ textAlign: 'center', color: 'white'}}>
					My Favorites List
				</h1>
				
				<div className='listContainer'>
					{favoriteProfiles.length > 0 &&
						favoriteProfiles?.map((person) => (
							<div key={person?.id}>
								<ContractorCard data={person} />
							</div>
						))}
				</div>
			</div>
			<Footer />
		</>
	);
}
