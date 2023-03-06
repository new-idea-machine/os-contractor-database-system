import React, { useContext, useEffect, useState } from 'react';
import './contractorCard.css';
import { contractorContext } from '../../contexts/ContractorContext';

export default function ContractorCard({ data }) {
	// const { contractor } = useContext(contractorContext);
	// console.log(data);
	const pdfURL = data?.resume;
	return (
		<>
			<div className='contractorCard flexCenter'>
				<div className='imageWrapper'>
					<img src={data?.profileImg} alt='Contractor headshot' />
				</div>
				<h1 onClick={() => console.log(data?.name)}>{data?.name}</h1>
				<h3>{data?.email}</h3>
				<h4>Resume</h4>
				<iframe src={pdfURL} width='100%' height='200px' />
			</div>
		</>
	);
}
