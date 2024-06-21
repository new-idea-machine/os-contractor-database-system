import React, { useEffect, useState, useContext, useRef } from 'react';
import './profile.css';
import { authContext } from '../../contexts/Authorization';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { techDataSchema, formInputs } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import { Routes, Route, useNavigate } from 'react-router-dom';


export default function ProfileForm(props) {
	const navigate = useNavigate();

	const { user } = useContext(authContext);
	const { updateUserProfile, userProfile } = useContext(userProfileContext);

	const [imgUrl, setImgUrl] = useState(userProfile?.profileImg);
	//const [availability, setAvailability] = useState('');
	//const [workSite, setWorkSite] = useState('');
	//const [resumeFileUrl, setResumeFileUrl] = useState({ resume: '' });
	const [initialFormData, setInitialFormData] = useState(techDataSchema);
	const [skills, setSkills] = useState([{ skill: '' }]);
	const [projects, setProjects] = useState([
		{ projectName: '', description: '' },
	]);



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


	useEffect(() => {
		if (userProfile) {
			console.log(userProfile.availabilityDetails);
		  setInitialFormData((prevState) => ({
			...prevState,
			email: userProfile.email || '',
			firstName: userProfile.firstName || '',
			id: userProfile.id,
			lastName: userProfile.lastName || '',
			qualification: userProfile.qualification || '',
			githubUrl: userProfile.otherInfo?.githubUrl || '',
			linkedinUrl: userProfile.otherInfo?.linkedinUrl || '',
			profileImg: userProfile.profileImg || '',
			projects: userProfile.projects || [],
			skills: userProfile.skills || [],
			summary: userProfile.summary || '',
			availability: userProfile.availability || '',
			availabilityDetails: userProfile.availabilityDetails || '',
			workSite: userProfile.workSite || '',

		  }));
		  setSkills(userProfile.skills || [{ skill: '' }]);
		  setProjects(userProfile.projects || [{  description: '' }]);
		  //setAvailability(currentUserProfile.availability || '');
		  //setWorkSite(currentUserProfile.workSite || '');
		  console.log(userProfile.availabilityDetails);

		}
	  }, [userProfile]);



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

	const onChange = (e) => {
		const { name, value } = e.target;


		setInitialFormData((prevState) => ({ ...prevState, [name]: value }));

	  };

	const onSubmit = (e) => {
		e.preventDefault();
		const data = {
			email:  initialFormData?.email || '',
			firstName: initialFormData.firstName ||'',
			id: userProfile?.id,
			lastName: initialFormData.lastName || '',
			qualification: initialFormData?.qualification ||  '',
			otherInfo: {
				githubUrl: userProfile?.githubUrl || initialFormData.githubUrl,
				linkedinUrl: userProfile?.linkedinUrl || initialFormData.linkedinUrl,

				//resume: currentUserProfile?.resume || initialFormData?.resume,
			},
			profileImg: userProfile?.profileImg || imgUrl,
			projects: projects,
			skills: skills,
			summary: initialFormData?.summary || '',
			availability: initialFormData?.availability,
			availabilityDetails: initialFormData?.availabilityDetails || '',
			workSite: initialFormData?.workSite,

		};

		console.log(data);
		updateUserProfile(data, () => {

			navigate('/myProfile');
		  });
	};

	return (
		<>
			{userProfile && (
				<div id='UpdateProfile'>
					<form id='UserProfile' ref={form} onSubmit={onSubmit}>
						<section id='PersonalInfo'>
							<div style={ { gridRowStart: "first-line", gridRowEnd: "last-line" } }>
								<div className='profileImgUpload'>
									<Upload
										setImgUrl={setImgUrl}
										imgUrl={imgUrl}
										profileImageUrl={imgUrl}
									/>
								</div>

								<InputSection field={ { type:  'text', name:  'firstName', label:  'First Name' } } value={userProfile?.firstName} />
								<InputSection field={ { type:  'text', name:  'lastName',  label:  'Last Name' } } value={userProfile?.lastName} />
								<InputSection field={ { type:  'text', name:  'location',  label:  'Location' } } value={userProfile?.location} />
								<InputSection field={ { type:  'email', name:  'email',  label:  'Email' } } value={userProfile?.email} />
							</div>

							<div style={ { gridColumnStart: "2", gridColumnEnd: "4" } }>
								<InputSection field={ { type:  'url', name:  'githubUrl',  label:  'GitHub' } } value={userProfile?.otherInfo?.githubUrl} />
								<InputSection field={ { type:  'url', name:  'linkedinUrl',  label:  'LinkedIn' } } value={userProfile?.otherInfo?.linkedinUrl} />
								<InputSection field={ { type:  'text', name:  'qualification',  label:  'Qualification' } } value={userProfile?.qualification} />
								<InputSection field={ { type:  'select', name:  'availability',  label:  'Availability', options: ['Full Time', 'Part Time', 'Other'] } } value={userProfile?.qualification} />
							</div>

							<div style={ { gridColumnStart: "2", gridColumnEnd: "4" } }>
								<label>Work location</label>
								<input type='radio' id='workSite1' name='workSite' value='On Site' checked={userProfile?.workSite === 'On Site'}/><label for='workSite1'>On Site</label>
								<input type='radio' id='workSite2' name='workSite' value='Hybrid' checked={userProfile?.workSite === 'Hybrid'}/><label for='workSite2'>Hybrid</label>
								<input type='radio' id='workSite3' name='workSite' value='Remote' checked={userProfile?.workSite === 'Remote'}/><label for='workSite3'>Remote</label>
							</div>

							<div style={ { gridColumnStart: "2", gridColumnEnd: "4" } }>
								<InputSection field={ { type:  'textArea', name:  'summary',  label:  'About' } } value={userProfile?.summary} />
							</div>
						</section>

						<section id="Projects">
							<h3>Projects</h3>
							{projects.map((project, index) => (
								<div key={index}>
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
							<button type='button' onClick={addProject}>Add Project</button>
						</section>

						<section id='Skills'>
							<h3>Skills</h3>
							{skills.map((skill, index) => (
								<InputSection
									key={index}
									value={skill.skill}
									field={{
										name: `skill`,
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
									onDelete={() => deleteSkill(index)}
								/>
							))}

							<button type="button" onClick={addSkill}>Add Skill</button>

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
