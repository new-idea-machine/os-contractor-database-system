import React, { useEffect, useState, useContext, useRef } from 'react';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import './profile.css';
import { authContext } from '../../contexts/Authorization';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { techDataSchema, formInputs } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ResponsiveGrid from '../ResponsiveGrid';

export default function ProfileForm(props) {
	const navigate = useNavigate();

	const { user } = useContext(authContext);
	const { updateUserProfile, userProfile } = useContext(userProfileContext);

	const [newImageFile, setNewImageFile] = useState(null);
	//const [availability, setAvailability] = useState('');
	//const [workSite, setWorkSite] = useState('');
	//const [resumeFileUrl, setResumeFileUrl] = useState({ resume: '' });
	const initialFormData = structuredClone(userProfile ? userProfile : techDataSchema);
	const [skills, setSkills] = useState(initialFormData.skills ? initialFormData.skills : []);
	const [projects, setProjects] = useState(initialFormData.projects ? initialFormData.projects : []);

	const deleteSkill = (index) => {
		setSkills((prevSkills) => {
		  const newSkills = [...prevSkills];
		  newSkills.splice(index, 1); // Remove the skill at the specified index
		  return newSkills;
		});
	  };

	  const deleteProject = (index) => {
		setProjects((prevProjects) => {
		  const newProjects = [...prevProjects];
		  newProjects.splice(index, 1);
		  return newProjects;
		});
	  };

	const addSkill = () => {
		setSkills((prevSkills) => [...prevSkills, { skill: '' }]);
	};

	const addProject = () => {
		setProjects((prevProjects) => [
			...prevProjects,
			{ description: '' },
		]);
	};

	const form = useRef();

	const onSubmit = async (event) => {
		event.preventDefault();

		try {
			// Upload new image

			let newImageUrl;

			if (newImageFile) {
				let storageRef = ref(store, `files/${uuidv4() + newImageFile.name}`);

				// const uploadTask = uploadBytesResumable(storageRef, file);
				//
				// uploadTask.on(
				// 	'state_changed',
				// 	(snapshot) => {
				// 		const progress = Math.round(
				// 			(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				// 		);
				// 		setProgresspercent(progress);
				// 	},
				// 	(error) => {
				// 		alert(error);
				// 	},
				// 	() => {
				// 		getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
				// 			setImgUrl(downloadURL);
				// 			setPreviewUrl(null);
				// 			onSubmit(downloadURL);
				// 			setProgresspercent(0);
				// 		});
				// 	}
				// );
		
				await uploadBytes(storageRef, newImageFile);
	
				newImageUrl = await getDownloadURL(storageRef);
			}

			// Upload new data

			const formElements = event.target.elements;
			const newUserProfile = structuredClone(initialFormData);
			
			newUserProfile.firstName = formElements.firstName.value;
			newUserProfile.lastName = formElements.lastName.value;
			newUserProfile.email =  formElements.email.value;
			newUserProfile.qualification = formElements.qualification.value;
			newUserProfile.summary = formElements.summary.value;
			newUserProfile.location = formElements.location.value;

			if (newImageUrl) newUserProfile.profileImg = newImageUrl;

			newUserProfile.otherInfo = {
				githubUrl: formElements.githubUrl.value,
				linkedinUrl: formElements.linkedinUrl.value,
			};
			
			newUserProfile.availability = formElements.availability.value;
			newUserProfile.workSite = formElements.workSite.value;
			newUserProfile.skills = skills;
			newUserProfile.projects = projects;

			await updateUserProfile(newUserProfile);

			// Delete old image (if any)

			const imageUrl = userProfile?.profileImg;

			if (imageUrl && newImageUrl && (imageUrl !== newImageUrl)) {
				const storageRef = ref(store, imageUrl);

				await deleteObject(storageRef);
			}

			navigate('/myProfile');
		} catch(error) {
			// Toast an error
		}
	};

	return (
		<>
			{userProfile && (
				<div id='UpdateProfile'>
					<form id='UserProfile' ref={form} onSubmit={onSubmit}>
						<section id='PersonalInfo'>
							<div className='profileImgUpload' style={{gridArea: "profileImg"}}>
								<Upload setNewImageFile={setNewImageFile} />
							</div>

							<InputSection field={ { type:  'text', name:  'firstName', label:  'First Name' } } value={initialFormData?.firstName} />
							<InputSection field={ { type:  'text', name:  'lastName',  label:  'Last Name' } } value={initialFormData?.lastName} />
							<InputSection field={ { type:  'text', name:  'location',  label:  'Location' } } value={initialFormData?.location} />
							<InputSection field={ { type:  'email', name:  'email',  label:  'Email' } } value={initialFormData?.email} />
							<InputSection field={ { type:  'url', name:  'githubUrl',  label:  'GitHub' } } value={initialFormData?.otherInfo?.githubUrl} />
							<InputSection field={ { type:  'url', name:  'linkedinUrl',  label:  'LinkedIn' } } value={initialFormData?.otherInfo?.linkedinUrl} />
							<InputSection field={ { type:  'text', name:  'qualification',  label:  'Qualification' } } value={initialFormData?.qualification} />
							<InputSection field={ { type:  'select', name:  'availability',  label:  'Availability', options: ['Full Time', 'Part Time', 'Other'] } } value={initialFormData?.qualification} />

							<label style={{gridArea: "workSite"}}>
								<span>Work location</span>
								<label><input type='radio' name='workSite' value='On Site' defaultChecked={initialFormData?.workSite === 'On Site'}/> On Site</label>
								<label><input type='radio' name='workSite' value='Hybrid' defaultChecked={initialFormData?.workSite === 'Hybrid'}/> Hybrid</label>
								<label><input type='radio' name='workSite' value='Remote' defaultChecked={initialFormData?.workSite === 'Remote'}/> Remote</label>
							</label>

							<InputSection field={ { type:  'textArea', name:  'summary',  label:  'About' } } value={initialFormData?.summary} />
						</section>

						<section id="Projects">
							<button type='button' style={{float: 'right'}} onClick={addProject}>Add Project</button>
							<h3>Projects</h3>
							<ResponsiveGrid minColumnWidth='400px' rowGap='10px'>
								{projects.map((project, index) => (
									<div className='Cell' key={index}>
										<InputSection
											value={project.description}
											field={{
												name: `description`,
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
											onDelete={() => deleteProject(index)}
										/>
									</div>
								))}
							</ResponsiveGrid>
						</section>

						<section id='Skills'>
							<h3>Skills</h3>
							<button style={{display: 'inline', width: '40px'}} type="button" onClick={addSkill}>+</button>
							{skills.map((skill, index) => (
								<span key={index} className='badge'>{skill.skill}</span>
// 								<InputSection
// 									key={index}
// 									value={skill.skill}
// 									field={{
// 										name: `skill`,
// 										label: `Skill ${index + 1}`,
// 										type: 'text',
// 
// 										placeholder: `Skill ${index + 1}`,
// 									}}
// 									onChange={(e) => {
// 										const value = e.target.value;
// 										setSkills((prevSkills) =>
// 											prevSkills.map((s, i) =>
// 												i === index ? { ...s, skill: value } : s
// 											)
// 										);
// 									}}
// 									onDelete={() => deleteSkill(index)}
// 								/>
							))}
			     			</section>
						<button type='submit'>
							<span>Save</span>
						</button>
					</form>
				</div>
			)}
		</>
	);
}
