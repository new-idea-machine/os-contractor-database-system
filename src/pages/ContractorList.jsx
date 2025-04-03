import React, { useContext, useEffect, useState } from 'react';
import { authContext } from "../contexts/Authorization";
import { userProfileContext } from '../contexts/UserProfileContext';
import { Navigation } from '../components';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ContractorCard from '../components/contractorCard/ContractorCard';
import ContractorProfile from '../components/ContractorProfile/ContractorProfile';

export default function ContractorList() {
	const { user } = useContext(authContext);
	const { contractors } = useContext(userProfileContext);
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
			<Navigation />
			<main>
				<h1>Hi, {user?.displayName ? user.displayName : "there"}!</h1>

				<p>
					&quot;Our success is determined by new developers finding career
					positions in other companies. We foster skill, determine will, and
					help to establish the right attitude in new devs, reducing your risk
					of hiring for your own development team.&quot;
				</p>

				<h2>Our Available Contractors</h2>

				{selectedContractor ?
					<div>
						<button onClick={() => setSelectedContractor(null)}>Close</button>
						<ContractorProfile data={selectedContractor} />
					</div> :
					<div>
						<ResponsiveGrid minColumnWidth="310px" rowGap="10px">
							{contractors.map((person) => (
								<div key={person.id}>
									<ContractorCard data={person} onClick={() => {
										setScrollPosition(window.scrollY);
										setSelectedContractor(person);
									}} />
								</div>
							))}
						</ResponsiveGrid>
					</div>
				}
			</main>
		</>
	);
}
