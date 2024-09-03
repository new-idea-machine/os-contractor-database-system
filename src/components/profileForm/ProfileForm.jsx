import React, { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import styles from './ProfileForm.module.css';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { techDataSchema } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import ChangePassword from '../ChangePassword';
import DeleteAccount from '../DeleteAccount';
import { useNavigate } from 'react-router-dom';
import ResponsiveGrid from '../ResponsiveGrid';
import Badge from '../Badge';

export default function ProfileForm(props) {
	const navigate = useNavigate();

	const { updateUserProfile, userProfile } = useContext(userProfileContext);

	const [newImageFile, setNewImageFile] = useState(null);
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
		const newSkill = window.prompt('Enter a skill:');

		if (newSkill && !skills.find((skill) => skill.skill === newSkill)) {
			setSkills((prevSkills) => [...prevSkills, { skill: newSkill }]);
		}
	};

	const addProject = () => {
		setProjects((prevProjects) => [
			...prevProjects,
			structuredClone(techDataSchema.projects[0])
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
			console.error(error);
			toast.error('Profile failed to be completely updated.');
		}
	};

	return (
		<>
			{userProfile && (
				<div id='UpdateProfile'>
					<form id='UserProfile' ref={form} onSubmit={onSubmit}>
						<section className={styles.PersonalInfo}>
							<div style={{gridArea: "profileImg"}}>
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

						<section className={styles.Projects}>
							<button type='button' style={{float: 'right', width: '200px'}} onClick={addProject}>Add Project</button>
							<h3>Projects</h3>
							<ResponsiveGrid minColumnWidth='250px' rowGap='20px' columnGap='20px'>
								{projects.map((project, index) => (
									<div className='Cell' key={project.title ? project.title : index}>
										<InputSection
											value={project.title}
											field={{
												name: 'title',
												label: `Project ${index + 1} Title`,
												type: 'text',
												placeholder: 'Title',
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, title: value } : p
													)
												);
											}}
										/>
										<InputSection
											value={project.url}
											field={{
												name: 'url',
												label: 'URL',
												type: 'text',
												placeholder: 'URL',
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, url: value } : p
													)
												);
											}}
										/>
										<InputSection
											value={project.description}
											field={{
												name: 'description',
												label: 'Description',
												type: 'textArea',
												placeholder: 'Description',
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

						<section>
							<h3>Skills</h3>
							<button style={{display: 'inline', width: '40px'}} type="button" onClick={addSkill}>+</button>
							{skills.map((skill, index) => (
								<Badge key={skill.skill} onClose={() => deleteSkill(index)}>{skill.skill}</Badge>
							))}
			     			</section>
						<button type='submit' style={{width: '100px', marginLeft: 'auto', marginRight: 'auto'}}>
							<span>Save</span>
						</button>
					</form>
					<ChangePassword />
					<DeleteAccount />
				</div>
			)}
		</>
	);
}
