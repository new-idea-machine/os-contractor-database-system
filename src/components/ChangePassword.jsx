import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { authContext } from '../contexts/Authorization';
import InputSection from './inputSection/InputSection';

import styles from './ChangePassword.module.css';

export default function ChangePassword() {
	const { user } = useContext(authContext);
	const [idToken, setIdToken] = useState(null);

	useEffect(() => {
		async function getIdToken() {
			if (user) {
				try {
					setIdToken(await user.getIdTokenResult());
				} catch {
					//
				}
			}
		}
		
		getIdToken();
	}, [user]);

	async function onSubmit(event) {
		event.preventDefault();

		const passwordStrength = /^(?=.*[0-9])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;

		const formElements = event.target.elements;

		const currentPassword = formElements.currentPassword.value;
		const newPassword = formElements.newPassword.value;
		const confirmPassword = formElements.confirmPassword.value;

		let fieldsAreValid = true;

		if (newPassword !== confirmPassword) {
			toast.error('The two new passwords aren\'t the same')
			fieldsAreValid = false;
		} else if (!passwordStrength.test(newPassword)) {
			toast.error('Please enter a password with at least 8 characters, one number, one lowercase, one upper case and one special character');
			fieldsAreValid = false;
		}

		const credential = EmailAuthProvider.credential(user.email, currentPassword);

		try {
			await reauthenticateWithCredential(user, credential)
		} catch {
			toast.error('The (current) password that you entered is incorrect')
			fieldsAreValid = false;
		}

		if (fieldsAreValid) {
			try {
				updatePassword(user, newPassword)
				toast.info('Password successfully changed!');
			} catch {
				toast.error('Failed to change password');
			}
		}
	}

	return ((idToken?.signInProvider === 'password') ?
		<>
			<h1>Change Password</h1>

			<form onSubmit={onSubmit}>
				<section className={styles.ChangePassword} >
					<InputSection field={ { type:  'password', name:  'currentPassword',  label:  'Current password' } } value='' />
					<InputSection field={ { type:  'password', name:  'newPassword',  label:  'New password' } } value='' />
					<InputSection field={ { type:  'password', name:  'confirmPassword', label:  'Confirm password' } } value='' />
				</section>

				<button type='submit' style={{width: '100px', marginLeft: 'auto', marginRight: 'auto'}}>
					<span>Save</span>
				</button>
			</form>
		</> :
		<></>);
}