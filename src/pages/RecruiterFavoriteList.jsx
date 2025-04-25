import React, { useContext, useEffect, useState } from 'react';
import { userProfileContext } from '../contexts/UserProfileContext';
import { favouritesContext } from '../contexts/FavouritesContext';
import { Navigation } from '../components';
import MatchCard from '../components/MatchCard';
import ContractorProfile from '../components/ContractorProfile/ContractorProfile';

export default function RecruiterFavoriteList() {
	const { favourites } = useContext(favouritesContext);
	const { getUserProfile } = useContext(userProfileContext);
	const favouriteProfiles = favourites.map((techId) => getUserProfile(techId));
	const [selectedContractor, setSelectedContractor] = useState(null);
	const [scrollPosition, setScrollPosition] = useState(0.0);

	useEffect(() => {
		/*
		A short timer is used to ensure that the DOM has been fully updated before any
		scrolling is done.
		*/

		const timeoutId = setTimeout(() => {
			window.scrollTo(0.0, selectedContractor ? 0.0 : scrollPosition);
		}, 10);

		return () => clearTimeout(timeoutId);
	}, [selectedContractor])

	return (
		<>
			<Navigation menu="Profile" />
			<main>
				<h2>My Favorites List</h2>

				{selectedContractor ?
					<ContractorProfile data={selectedContractor} onClose={() => setSelectedContractor(null)} /> :
					<>
						{favouriteProfiles?.map((person) => (
							<div key={person.id}>
								<MatchCard contractor={person} onClick={() => {
									setScrollPosition(window.scrollY);
									setSelectedContractor(person);
								}} />
							</div>
						))}
					</>
				}
			</main>
		</>
	);
}
