import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContractorCard from '../components/contractorCard/ContractorCard';
import { contractorContext } from '../contexts/ContractorContext';

export default function Home() {
	const navigate = useNavigate();
	return (
		<>
			<div className='homePage flexCenter'>
				<h1 style={{ textAlign: 'center', color: 'white' }}>
					Welcome to our contractor database system, which is a software
					application that enables users to store, manage, and access
					information related to contractors.
				</h1>
				<div
					className='customButton4'
					onClick={() => navigate('contractorlist')}
				>
					<span>Continue</span>
				</div>
			</div>
		</>
	);
}
