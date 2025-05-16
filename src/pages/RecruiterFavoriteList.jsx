import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from 'react-toastify';
import { userProfileContext } from '../contexts/UserProfileContext';
import { favouritesContext } from '../contexts/FavouritesContext';
import { Navigation } from '../components';
import SearchBar from '../components/SearchBar';
import MatchCard from '../components/MatchCard';
import ContractorProfile from '../components/ContractorProfile/ContractorProfile';

import { parseKeywords, findKeywordsIn } from '../components/Chat/search';

export default function RecruiterFavoriteList() {
	const navigate = useNavigate();
	const [user] = useAuthState(auth);
	const [keywords, setKeywords] = useState("");
	const { favourites } = useContext(favouritesContext);
	const { getUserProfile } = useContext(userProfileContext);
	const favouriteProfiles = favourites.map((techId) => getUserProfile(techId));
	const [selectedContractor, setSelectedContractor] = useState(null);
	const [scrollPosition, setScrollPosition] = useState(0.0);

	useEffect(() => {
		if (user === null) {
			toast.error('Please Login To View Favourites');
			navigate('/');
		}
	}, [user]);

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

	function filterContractors() {
		const keywordExpressions = parseKeywords(keywords);

		if (keywordExpressions.length === 0) {
			return favouriteProfiles;
		} else {
			const newContractorsList = [];

			favouriteProfiles.forEach((profile) => {
				if (findKeywordsIn(keywordExpressions, profile.firstName) ||
					findKeywordsIn(keywordExpressions, profile.lastName) ||
					findKeywordsIn(keywordExpressions, profile.summary)
				) {
					newContractorsList.push(profile);
				}
			});

			return newContractorsList;
		}
	}

	const filteredContractors = filterContractors();

	return (
		<>
			<Navigation menu="Profile" />
			<main>
				<h2>My Favorites List</h2>

				{selectedContractor ?
					<ContractorProfile data={selectedContractor} onClose={() => setSelectedContractor(null)} /> :
					<>
					        <SearchBar placeholder="Find favourite contractor" defaultValue={ keywords } setSearchTerms={ setKeywords }/>
						{filteredContractors?.map((person) => (
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
