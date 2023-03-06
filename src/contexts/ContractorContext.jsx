import React, { useState, useEffect, createContext } from 'react';
// import axios from 'axios';
import data from '../constants/data';

export const contractorContext = createContext();

const ContractorContext = ({ children }) => {
	const [contractorList, setContractorList] = useState(data?.contractors);
	const [contractor, setContractor] = useState(null);

	console.log("contractor", contractor)

	// useEffect(() => {}, [setContractorList(data?.contractors)]);

	const appStates = {
		contractorList,
		setContractorList,
		setContractor,
		contractor,
	};

	return (
		<contractorContext.Provider value={appStates}>
			{children}
		</contractorContext.Provider>
	);
};

export default ContractorContext;
