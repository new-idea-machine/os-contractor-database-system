import React, { useContext } from 'react';
import { authContext } from "../contexts/Authorization";
import { contractorContext } from '../contexts/ContractorContext';
import { Navigation } from '../components';
import ResponsiveGrid from '../components/ResponsiveGrid';
import ContractorCard from '../components/contractorCard/ContractorCard';

export default function ContractorList() {
	const { user } = useContext(authContext);
	const { contractorList } = useContext(contractorContext);

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

				<ResponsiveGrid minColumnWidth="310px" rowGap="10px">
					{contractorList.map((person, index) => (
						<div key={index}>
							<ContractorCard data={person} />
						</div>
					))}
				</ResponsiveGrid>
			</main>
		</>
	);
}
