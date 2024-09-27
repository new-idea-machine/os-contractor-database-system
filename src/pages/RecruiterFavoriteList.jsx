import React, { useContext } from 'react';
import { userProfileContext } from '../contexts/UserProfileContext';
import { favouritesContext } from '../contexts/FavouritesContext';
import { Navigation } from '../components';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ContractorCard from '../components/contractorCard/ContractorCard';

export default function RecruiterFavoriteList() {
	const { favourites } = useContext(favouritesContext);
	const { getUserProfile } = useContext(userProfileContext);
	const favouriteProfiles = favourites.map((techId) => getUserProfile(techId));

	return (
		<>
			<Navigation menu="Profile" />
			<main className='contractorListPage'>
				<h1 style={{ textAlign: 'center', color: 'white'}}>
					My Favorites List
				</h1>

				<ResponsiveGrid minColumnWidth="310px" rowGap="10px">
					{favouriteProfiles.length > 0 &&
						favouriteProfiles?.map((person, index) => (
							<div key={index}>
								<ContractorCard data={person} />
							</div>
						))}
				</ResponsiveGrid>
			</main>
		</>
	);
}
