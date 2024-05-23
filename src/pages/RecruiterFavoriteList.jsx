import React, { useContext, useEffect, useState} from 'react';
import { contractorContext } from '../contexts/ContractorContext';
import { recruiterContext, getFavoriteList } from '../contexts/RecruiterContext';
import { Navigation } from '../components';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { db} from '../firebaseconfig';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	getDoc

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
		console.log(favoriteList);
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
			<Navigation menu="Profile" />
			<main className='contractorListPage'>
				<h1 style={{ textAlign: 'center', color: 'white'}}>
					My Favorites List
				</h1>

				<ResponsiveGrid minColumnWidth="310px" rowGap="10px">
					{favoriteProfiles.length > 0 &&
						favoriteProfiles?.map((person, index) => (
							<div key={index}>
								<ContractorCard data={person} />
							</div>
						))}
				</ResponsiveGrid>
			</main>
		</>
	);
}
