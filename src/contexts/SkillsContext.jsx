import React, { useState, useEffect, useContext, createContext } from 'react';
import { contractorsContext } from '../contexts/ContractorsContext';

export const skillsContext = createContext();

const SkillsContext = ({ children }) => {
	const contractorList = useContext(contractorsContext);
	const [skillsLists, setSkillsLists] = useState([]);

	useEffect(() => {
		const newSkillsLists = {};

		for (const contractor of contractorList) {
			if (contractor.qualification) {
				const qualification = contractor.qualification;

				if (newSkillsLists[qualification] === undefined) {
					newSkillsLists[qualification] = [];
				}

				for (const skill of contractor?.skills) {
					if (!newSkillsLists[qualification].includes(skill.skill)) {
						newSkillsLists[qualification].push(skill.skill);
					}
				}
			}
		}

		setSkillsLists(newSkillsLists);
	}, [contractorList]);

	const appStates = {
		skillsLists
	};

	return (
		<skillsContext.Provider value={appStates}>
			{children}
		</skillsContext.Provider>
	);
};

export default SkillsContext;
