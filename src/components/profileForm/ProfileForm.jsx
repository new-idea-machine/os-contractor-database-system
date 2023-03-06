import React, { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import './profile.css';
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';

export default function ProfileForm() {
	const { user } = useContext(authContext);
	const { contractorList, updateTechObject } = useContext(contractorContext);
	const [userToUpdate, setUserToUpdate] = useState({});

	useEffect(() => {
		if (user && contractorList) {
			// console.log(contractorList);
			const mathcUserWithProfile = contractorList.find(
				(tech) => tech?.firebaseUID === user?.uid
			);
			setUserToUpdate(mathcUserWithProfile);
		} else {
			console.log('No Match');
		}
	}, []);

	const [formData, setFormData] = useState({
		id: '001',
		name: 'Taylor',
		profileImg: {},
		email: 'taylor@newideamachine.com',
		techStack: [{ tech: '' }],
		// otherInfo: {
		linkedinUrl: '',
		githubUrl: '',
		resume: {},
		// },
		summary: '',
		skills: [{ skill: '' }, { skill: '' }, { skill: '' }, { skill: '' }],
		interests: [{ interest: '' }, { interest: '' }, { interest: '' }],
		// projects: [
		// 	{
		projectName: '',
		techStack: [{ tech: '' }],
		role: '',
		description: '',
		// },
		// {
		// 	projectName: '',
		// 	techStack: [{ tech: '' }],
		// 	role: '',
		// 	description: '',
		// },
		// {
		// 	projectName: '',
		// 	techStack: [{ tech: '' }],
		// 	role: '',
		// 	description: '',
		// 	},
		// ],
	});
	const form = useRef();

	const {
		// Personal Info
		name,
		email,
		// Technical Info
		projectName,
		description,
		// Other Info
		linkedinUrl,
		githubUrl,
	} = formData;

	// Handle Input change
	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const data = {
			id: userToUpdate?.id,
			otherInfo: {
				linkedinUrl: linkedinUrl,
				githubUrl: githubUrl,
			},
			projects: [{ projectName: projectName, description: description }],
		};
		console.log('data to update', data);
		updateTechObject(data);
		// console.log('test', formData);
	};

	return (
		<>
			<div className='updateForm flexCenter'>
				<form className='flexCenter' ref={form} onSubmit={onSubmit}>
					<h1 onClick={() => onSubmit()}>Update Profile</h1>
					<div className='formSection flexCenter'>
						<h3>Personal Info</h3>
						<input
							name='name'
							value={name}
							placeholder='Test'
							type='text'
							onChange={onChange}
						/>
						<input
							name='email'
							value={email}
							placeholder='Test'
							type='email'
							onChange={onChange}
						/>
					</div>
					<div className='formSection flexCenter'>
						<h3>Technical Info</h3>
						<input
							name='projectName'
							value={projectName}
							placeholder='Test'
							type='text'
							onChange={onChange}
						/>
						<input
							name='description'
							value={description}
							placeholder='Test'
							type='text'
							onChange={onChange}
						/>
					</div>
					<div className='formSection flexCenter'>
						<h3>Other Info</h3>
						<input
							name='linkedinUrl'
							value={linkedinUrl}
							placeholder='Test'
							type='text'
							onChange={onChange}
						/>
						<input
							name='githubUrl'
							value={githubUrl}
							placeholder='Test'
							type='text'
							onChange={onChange}
						/>
					</div>
					<button className='customButton' type='submit'>
						<span>Update</span>
					</button>
				</form>
			</div>
		</>
	);
}
