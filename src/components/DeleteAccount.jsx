import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { authContext } from '../contexts/Authorization';
import { userProfileContext } from '../contexts/UserProfileContext';
import InputSection from './inputSection/InputSection';

import styles from './DeleteAccount.module.css';

const numDaysUntilDeletion = 30;

export default function DeleteAccount() {
	const { user, logout } = useContext(authContext);
	const { userProfile, updateUserProfile } = useContext(userProfileContext);
	const navigate = useNavigate();

	async function onSubmit(event) {
		event.preventDefault();

		const formElements = event.target.elements;
		const currentPassword = formElements.currentPassword.value;
		const credential = EmailAuthProvider.credential(user.email, currentPassword);

		let passwordIsValid = true;

		try {
			await reauthenticateWithCredential(user, credential)
		} catch {
			toast.error('The password that you entered is incorrect')
			passwordIsValid = false;
		}

		if (passwordIsValid) {
			const newUserProfile = structuredClone(userProfile);

			newUserProfile.deleteBy = new Date();

			newUserProfile.deleteBy.setDate(newUserProfile.deleteBy.getDate() + numDaysUntilDeletion + 1);

			try {
				await updateUserProfile(newUserProfile);
				toast.info(`Your user account will be deleted in ${numDaysUntilDeletion} days -- log in again to reactivate your account`);
				logout();
				navigate('/');
			} catch {
				toast.error('Failed to deactivate account');
			}
		}
	}

	return (
		<>
			<h1>Deactivate account</h1>

			<form onSubmit={onSubmit}>
				<section className={styles.DeleteAccount} >
					<InputSection field={ { type:  'password', name:  'currentPassword',  label:  'Current password' } } value='' />
				</section>

				<button type='submit' style={{width: '120px', marginLeft: 'auto', marginRight: 'auto'}}>
					<span>Deactivate</span>
				</button>
			</form>
		</>
	);
}