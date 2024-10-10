import React, { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import styles from './RecruiterProfileForm.module.css';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { enforceSchema, recDataSchema } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import ChangePassword from '../ChangePassword';
import DeleteAccount from '../DeleteAccount';
import { useNavigate } from 'react-router-dom';

export default function RecruiterProfileForm(props) {
	const navigate = useNavigate();

	const { updateUserProfile, userProfile } = useContext(userProfileContext);

	const [newImageFile, setNewImageFile] = useState(null);
	const initialFormData = enforceSchema(userProfile ? structuredClone(userProfile) : {}, recDataSchema);

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
			newUserProfile.linkedinUrl = formElements.linkedinUrl.value;
			newUserProfile.companyName = formElements.companyName.value;
			newUserProfile.companyInfo = formElements.companyInfo.value;
			newUserProfile.phone = formElements.phone.value;

			if (newImageUrl) newUserProfile.profileImg = newImageUrl;

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
					<form ref={form} onSubmit={onSubmit}>
						<section className={styles.PersonalInfo}>
							<div style={{gridArea: "profileImg"}}>
								<Upload setNewImageFile={setNewImageFile} />
							</div>

							<InputSection field={ { type:  'text', name:  'firstName', label:  'First Name' } } value={initialFormData?.firstName} />
							<InputSection field={ { type:  'text', name:  'lastName',  label:  'Last Name' } } value={initialFormData?.lastName} />
							<InputSection field={ { type:  'text', name:  'phone',  label:  'Phone No.' } } value={initialFormData?.phone} />
							<InputSection field={ { type:  'email', name:  'email',  label:  'Email' } } value={initialFormData?.email} />
							<InputSection field={ { type:  'text', name:  'qualification',  label:  'Qualification' } } value={initialFormData?.qualification} />
							<InputSection field={ { type:  'url', name:  'linkedinUrl',  label:  'LinkedIn' } } value={initialFormData?.linkedinUrl} />
							<InputSection field={ { type:  'text', name:  'companyName',  label:  'Company Name' } } value={initialFormData?.companyName} />
							<InputSection field={ { type:  'textArea', name:  'companyInfo',  label:  'About Us' } } value={initialFormData?.companyInfo} />
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
