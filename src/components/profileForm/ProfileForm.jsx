import React, { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import './profile.css';
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function ProfileForm() {
	const { user } = useContext(authContext);
	const { contractorList, updateTechObject } = useContext(contractorContext);
	const [userToUpdate, setUserToUpdate] = useState({});
	const [imgUrl, setImgUrl] = useState(null);
	const [progresspercent, setProgresspercent] = useState(0);

	useEffect(() => {
		// console.log(contractorList);
		if (user && contractorList) {
			const mathcUserWithProfile = contractorList.find(
				(tech) => tech?.firebaseUID === user?.uid
			);
			console.log('MATCHED', mathcUserWithProfile);
			setUserToUpdate(mathcUserWithProfile);
		} else {
			console.log('No Match');
		}
	}, [contractorList]);

	const [formData, setFormData] = useState({
		id: '',
		name: '',
		profileImg: {},
		email: '',
		techStack: [{ tech: '' }],
		// otherInfo: {
		linkedinUrl: '',
		githubUrl: '',
		resume: '',
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
	const uploadForm = useRef();

	const {
		// Personal Info
		name,
		email,
		resume,
		// Technical Info
		projectName,
		description,
		// Other Info
		linkedinUrl,
		githubUrl,
	} = formData;

	const handleSubmit = (e) => {
		e.preventDefault();
		const file = e.target[0]?.files[0];
		console.log('!!!', file);
		if (!file) return;
		const storageRef = ref(store, `files/${uuidv4() + file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgresspercent(progress);
			},
			(error) => {
				alert(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					// handleUpdate(file, downloadURL);
					setImgUrl(downloadURL);

					//   console.log("####", imgUrl)
				});
			}
		);
	};

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
			resume: resume,
			profileImg: imgUrl,
			projects: [{ projectName: projectName, description: description }],
		};
		console.log('data to update', data);
		updateTechObject(data);
		// console.log('test', formData);
	};

	return (
		<>
			<div className='updateForm flexCenter'>
				<form onSubmit={handleSubmit} className='form' ref={uploadForm}>
					<input type='file' />
					<button type='submit'>Upload</button>
				</form>
				{!imgUrl && (
					<div
						className='outerbar'
						style={{
							border: '2px solid white',
							background: 'white',
							width: '200px',
						}}
					>
						<div
							className='innerbar'
							style={{
								width: `${progresspercent}%`,
								background: 'red',
							}}
						>
							{progresspercent}%
						</div>
					</div>
				)}
				{imgUrl && <img src={imgUrl} alt='uploaded file' height={200} />}
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
						{/* <input type='file' />
						<button
							onClick={() => {
								handleSubmit();
							}}
						>
							Upload
						</button> */}
					</div>
					{/* {!imgUrl && (
						<div className='outerbar'>
							<div
								className='innerbar'
								style={{ width: `${progresspercent}%` }}
							>
								{progresspercent}%
							</div>
						</div>
					)}
					{imgUrl && <img src={imgUrl} alt='uploaded file' height={200} />} */}
					<button className='customButton' type='submit'>
						<span>Update</span>
					</button>
				</form>
			</div>
		</>
	);
}
