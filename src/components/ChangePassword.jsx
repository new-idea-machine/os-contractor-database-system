import React, { useEffect, useState, useContext } from 'react';
import { authContext } from '../contexts/Authorization';
import InputSection from './inputSection/InputSection';

import './ChangePassword.css';

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

	return ((idToken?.signInProvider === 'password') ?
		<>
			<h1>Change Password</h1>

			<form id='ChangePassword'>
				<section id="Passwords">
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