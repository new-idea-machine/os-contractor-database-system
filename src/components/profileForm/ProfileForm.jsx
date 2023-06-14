import React, { useEffect, useState, useContext, useRef } from 'react';
import './profile.css';
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';
import { techDataSchema, formInputs } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import { Routes, Route, useNavigate } from 'react-router-dom';


export default function ProfileForm(props) {
	const navigate = useNavigate();

	const { user } = useContext(authContext);
	const {
		updateTechObject,
		currentUserProfile,
		matchProfileToCurrentUser,
		contractorMap,
		getFirestore
	} = useContext(contractorContext);
	 //const [profileImageUrl, setProfileImageUrl] = useState(null);
	const [imgUrl, setImgUrl] = useState(null);
	//const [resumeFileUrl, setResumeFileUrl] = useState({ resume: '' });
	const [initialFormData, setInitialFormData] = useState(techDataSchema);
	const [skills, setSkills] = useState([{ skill: '' }]);
	const [projects, setProjects] = useState([
		{ projectName: '', description: '' },
	]);
	const [reloadForm, setReloadForm] = useState(false);
	

	

	useEffect(() => {
		if (currentUserProfile || reloadForm) {
		  setInitialFormData((prevState) => ({
			...prevState,
			email: currentUserProfile.email || '',
			firstName: currentUserProfile.firstName || '',
			id: currentUserProfile.id,
			lastName: currentUserProfile.lastName || '',
			qualification: currentUserProfile.qualification || '',
			githubUrl: currentUserProfile.otherInfo?.githubUrl || '',
			linkedinUrl: currentUserProfile.otherInfo?.linkedinUrl || '',
			profileImg: currentUserProfile.profileImg || '',
			projects: currentUserProfile.projects || [],
			skills: currentUserProfile.skills || [],
			summary: currentUserProfile.summary || '',
		  }));
		  setSkills(currentUserProfile.skills || [{ skill: '' }]);
		  setProjects(currentUserProfile.projects || [{ projectName: '', description: '' }]);
		  setImgUrl(null);
		  setReloadForm(false); // Reset reloadForm after form reload
		} else {
			setInitialFormData(techDataSchema); // Reset form data to initial state
			setSkills([{ skill: '' }]); // Reset skills to initial state
			setProjects([{ projectName: '', description: '' }]); // Reset projects to initial state
			setImgUrl(null); // Reset image URL
		  }
	  }, [currentUserProfile, reloadForm]);

	 

	const addSkill = () => {
		setSkills((prevSkills) => [...prevSkills, { skill: '' }]);
	};

	const addProject = () => {
		setProjects((prevProjects) => [
			...prevProjects,
			{ projectName: '', description: '' },
		]);
	};

	const form = useRef();

	const onChange = (e) => {
		const { name, value } = e.target;
		setInitialFormData((prevState) => ({ ...prevState, [name]: value }));
		
	  };

	const onSubmit = (e) => {
		e.preventDefault();
		const data = {
			email:  initialFormData?.email || '',
			firstName: initialFormData.firstName ||'',
			id: currentUserProfile?.id,
			lastName: initialFormData.lastName || '',
			qualification: initialFormData?.qualification ||  '',
			otherInfo: {
				githubUrl: currentUserProfile?.githubUrl || initialFormData.githubUrl,
				linkedinUrl: currentUserProfile?.linkedinUrl || initialFormData.linkedinUrl,
				
				//resume: currentUserProfile?.resume || initialFormData?.resume,
			},
			profileImg: initialFormData?.imgUrl || '',
			projects: projects,
			skills: skills,
			summary: initialFormData?.summary || '',
			
			           
			
			
		};
		console.log(data);
		updateTechObject(data, () => {
			setReloadForm(true);
			navigate('/myProfile');
		  });
	};

	
	return (
		<>
			{currentUserProfile && (
				<div className='updateForm flexCenter'>
					<form className='flexCenter' ref={form} onSubmit={onSubmit}>
						<div className='formContainer'>
							{formInputs?.map((section) => (
								<div key={section?.sectionTitle} className='formSection '>
									<h3>{section?.sectionTitle}</h3>
									{section?.fields?.map((field) => (
										<InputSection
											key={field?.name}
											value={initialFormData[field?.name] || ''}
											field={field}
											onChange={onChange}
										/>
									))}
								</div>
							))}
							{/* </div>
						<div className='flexCenter formContainer'> */}
							<div className='formSection '>
								<h3>Projects</h3>
								{projects.map((project, index) => (
									<div
										key={`project-${index}`}
										// className='formSection '
										style={{ flexDirection: 'column', display: 'flex' }}
									>
										<InputSection
											value={project.projectName}
											field={{
												name: `projectName-${index}`,
												label: `Project ${index + 1} Name`,
												placeholder: `Project ${index + 1} Name`,
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, projectName: value } : p
													)
												);
											}}
										/>
										<InputSection
											value={project.description}
											field={{
												name: `description-${index}`,
												label: `Project ${index + 1} Description`,
												type: 'textArea',
												placeholder: `Project ${index + 1} Description`,
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, description: value } : p
													)
												);
											}}
										/>
									</div>
								))}
								<button type='button' onClick={addProject}>
									Add Project
								</button>
							</div>

							<div className='formSection'>
								<h3>Skills</h3>
								{skills.map((skill, index) => (
									<InputSection
										key={`skill-${index}`}
										value={skill.skill}
										field={{
											name: `skill-${index}`,
											label: `Skill ${index + 1}`,
											type: 'text',

											placeholder: `Skill ${index + 1}`,
										}}
										onChange={(e) => {
											const value = e.target.value;
											setSkills((prevSkills) =>
												prevSkills.map((s, i) =>
													i === index ? { ...s, skill: value } : s
												)
											);
										}}
									/>
								))}
								<button type='button' onClick={addSkill}>
									Add Skill
								</button>
							</div>
						</div>
						<button className='customButton' type='submit'>
							<span>Save</span>
						</button>
					</form>
					<div className='profileImgUpload'>
						<Upload
							setImgUrl={setImgUrl}
							imgUrl={imgUrl}
							// setProfileImageUrl={setProfileImageUrl}
						/>
					</div>
				</div>
			)}
		</>
	);
}
