import React, { useContext, useEffect, useState } from 'react';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';

export default function ContractorList() {
	const { contractorList } = useContext(contractorContext);
	useEffect(() => {
		console.log(contractorList);
	}, []);
	return (
		<>
			<div className='contractorListPage'>
				<h1 style={{ textAlign: 'center', color: 'white' }}>
					Our Available Contractors
				</h1>
				<p
					style={{
						textAlign: 'center',
						color: 'white',
						width: '60%',
					}}
				>
					&quot;Our success is determined by new developers finding career
					positions in other companies. We foster skill, determine will, and
					help to establish the right attitude in new devs, reducing your risk
					of hiring for your own development team.&quot;
				</p>
				<div className='listContainer'>
					{contractorList.length > 0 &&
						contractorList?.map((person) => (
							<>
								<ContractorCard key={person?.id} data={person} />
							</>
						))}
				</div>
			</div>
		</>
	);
}
