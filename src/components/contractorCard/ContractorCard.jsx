import React, { useContext, useEffect, useState } from 'react';
import './contractorCard.css';
import { contractorContext } from '../../contexts/ContractorContext';

export default function ContractorCard({ data }) {
	console.log(data);
	return (
		<>
			<div className='contractorCard flexCenter'>
				<div className='imageWrapper'>
					<img src={data?.profileImg} alt='Contractor headshot' />
				</div>
				<h1>{data?.name}</h1>
				<h3>{data?.email}</h3>
			</div>
		</>
	);
}
