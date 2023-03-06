import React, { useContext, useEffect, useState } from 'react';
import './contractorCard.css';
import { contractorContext } from '../../contexts/ContractorContext';
import { useNavigate } from "react-router-dom";

export default function ContractorCard({ data }) {
	const { contractor } = useContext(contractorContext);
	const navigate = useNavigate();
	console.log("data", data);
	return (
		<>
			<div className='contractorCard flexCenter' onClick={() => navigate(`/contractor/${data?.id}`)}>
				<div className='imageWrapper'>
					<img src={data?.profileImg} alt='Contractor headshot' />
				</div>
				<h1 onClick={() => console.log(contractor)}>{data?.name}</h1>
				<h3>{data?.email}</h3>
			</div>
		</>
	);
}
