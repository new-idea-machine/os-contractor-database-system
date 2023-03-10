import React, { useEffect, useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import './profile.css';
import { authContext } from '../../contexts/auth';
import { contractorContext } from '../../contexts/ContractorContext';
import { techDataSchema, formInputs } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';

export default function ProfileForm() {
	const { user } = useContext(authContext);
	const { updateTechObject, currentUserProfile } =
		useContext(contractorContext);
	const [profileImageUrl, setProfileImageUrl] = useState(
		currentUserProfile?.profileImg
	);
	const [initialFormData, setInitialFormData] = useState(techDataSchema);
	const form = useRef();

	const onChange = (e) => {
		setInitialFormData((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const data = {
			id: currentUserProfile?.id,
			otherInfo: {
				linkedinUrl: initialFormData.linkedinUrl,
				githubUrl: initialFormData.githubUrl,
			},
			profileImg: profileImageUrl || currentUserProfile?.profileImg,
			projects: [
				{
					projectName: initialFormData.projectName,
					description: initialFormData.description,
				},
			],
		};
		console.log(data);
		updateTechObject(data);
	};

	return (
		<>
			{currentUserProfile && (
				<div className='updateForm flexCenter'>
					<div className='profileImgUpload'>
						<Upload
							setImgUrl={setProfileImageUrl}
							imgUrl={profileImageUrl}
							setProfileImageUrl={setProfileImageUrl}
						/>
					</div>
					<form className='flexCenter' ref={form} onSubmit={onSubmit}>
						{formInputs?.map((section) => (
							<div
								key={section?.sectionTitle}
								className='formSection flexCenter'
							>
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
						<div className='formSection flexCenter'>
							<label>
								<input name='test' type='text' placeholder='Test' />
							</label>
						</div>
						<button className='customButton' type='submit'>
							<span>Update</span>
						</button>
					</form>
				</div>
			)}
		</>
	);
}
