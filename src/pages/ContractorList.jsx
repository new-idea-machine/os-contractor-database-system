import React, { useContext } from 'react';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';
import { Navigation } from '../components';

export default function ContractorList() {
	const { contractorList } = useContext(contractorContext);

	return (
		<>
			<Navigation />
			<main>
				<h1>Our Available Contractors</h1>

				<p>
					&quot;Our success is determined by new developers finding career
					positions in other companies. We foster skill, determine will, and
					help to establish the right attitude in new devs, reducing your risk
					of hiring for your own development team.&quot;
				</p>

				<section className='listContainer'>
					{contractorList.map((person, index) => (
						<div key={index}>
							<ContractorCard data={person} />
						</div>
					))}
				</section>
			</main>
		</>
	);
}
