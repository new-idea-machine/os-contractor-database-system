import React, { useState, useEffect, useContext, createContext } from 'react';
import { userProfileContext } from '../contexts/UserProfileContext';
import { developerSkills } from "../constants/skills/developerSkills.js";
import { designerSkills } from "../constants/skills/designerSkills";
import { productManagerSkills } from "../constants/skills/productManagerSkills";
import { projectManagerSkills } from "../constants/skills/projectManagerSkills";

/*
This context exports "skillsLists" which is (functionally) an associative array.  Elements in
the array are indexed by qualification (string) and each element in the array is an array of
skills for that qualification.

For example:

	skillsLists["Developer"] --> ["C", "JavaScript", "HTML", "React"]
	skillsLists["Product Manager"] --> ["Researching", "Business Administration", "HR"]
*/

/*
"allSkills" is an array of all of the skills listed in the "constants/skills" files (there may
be duplicates -- that's okay).  If a contractor has one of these skills then it will be used
instead (to preserve case and readability).

"allSkillsLowerCase" is like "allSkills" but is faster to search.
*/

const allSkills = developerSkills.concat(designerSkills).concat(productManagerSkills).concat(projectManagerSkills);
const allSkillsLowerCase = allSkills.map((skill) => skill.trim().toLocaleLowerCase());

export const skillsContext = createContext();

const SkillsContext = ({ children }) => {
	const { contractors } = useContext(userProfileContext);
	const [skillsLists, setSkillsLists] = useState([]);

	useEffect(() => {
		const newSkillsLists = {};

		/*
		This is the main loop.  During each iteration, a contractor's list of skills is
		extracted and added to the master list of skills.
		*/

		for (const contractor of contractors) {
			if (contractor.qualification) {
				const qualification = contractor.qualification;

				if (newSkillsLists[qualification] === undefined) {
					newSkillsLists[qualification] = [];
				}

				for (const skill of contractor?.skills) {
					/*
					In order to preserve case, if a skill is in "allSkills"
					then the string from "allSkills" is used; if not then
					there's no choice but to use the string from the
					contractor.
					*/

					const skillLowerCase = skill.skill.toLocaleLowerCase();

					if (!newSkillsLists[qualification].find((element) => element.toLocaleLowerCase() === skillLowerCase)) {
						const index = allSkillsLowerCase.findIndex((element) => element === skillLowerCase);

						newSkillsLists[qualification].push(index >= 0 ? allSkills[index] : skill.skill);
					}
				}
			}
		}

		setSkillsLists(newSkillsLists);
	}, [contractors]);

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
