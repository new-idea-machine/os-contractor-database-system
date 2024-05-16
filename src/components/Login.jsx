import React, { useContext, useEffect } from 'react';
import { authContext } from '../contexts/Authorization';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLoginButton, XLoginButton } from 'react-social-login-buttons';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default function Login() {
	const { setCredential, login, loginWithGoogle, loginWithTwitter, user } = useContext(authContext);

	// From https://www.abstractapi.com/tools/email-regex-guide
	const validateEmailAddress = /^[a-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i;

	const navigate = useNavigate();

	async function resetPassword(event) {
		const formElements = event.target.form.elements;
		const email = formElements.Email.value;

		if (!validateEmailAddress.test(email)) {
			toast.error('That\'s not a valid e-mail address.');
		}
		else {
			try {
				const auth = getAuth();
				await sendPasswordResetEmail(auth, email);
				toast.info('Password reset link sent successfully!  Please check your email.');
			} catch (error) {
				toast.info('This e-mail address isn\'t in our system.  Select "Login or Register" to start registering.');
			}
		}
	};

	async function handleEmailLogin(submitEvent) {
		submitEvent.preventDefault();

		const formElements = submitEvent.target.elements;
		const email = formElements.Email.value;
		const password = formElements.Password.value;

		if (!validateEmailAddress.test(email)) {
			toast.error('That\'s not a valid e-mail address.');
		}
		else {
			try {
				const result = await login(email, password);

				if (result === 'auth/user-not-found') {
					setCredential({ email, password });
				}
				else if (result === 'auth/wrong-password') {
					toast.error('The password is incorrect.');
				}
			} catch (error) {
				console.error(`Error occurred during login:  ${error.message}`);
				toast.error(error.message);
			}
		}
	};

	useEffect(() => {
		if (user?.displayName) {
		  navigate('/contractorlist');
		  toast.info(`Welcome, ${user?.displayName}!`);
		}
	}, [user, navigate]);

	return (
		<>
			<p style={{textAlign: 'left'}}>
				Log in or register
			</p>

			<form onSubmit={(event) => handleEmailLogin(event)}>
				<input
					name='Email'
					type='email'
					placeholder='E-mail'
					autoComplete='off'
				/>

				<input
					name='Password'
					type='password'
					placeholder='Password'
					autoComplete='off'
				/>

				<input type='submit' value='Log in/Register' />
				<input type='button' value='Forgot password' onClick={resetPassword}/>
			</form>

			<p className="splitBar">
				or
			</p>

			<XLoginButton align='center' style={{width: '400px', borderRadius:  '10px', margin: '22px 0px'}} onClick={loginWithTwitter}>
				Log in/Register with X
			</XLoginButton>

			<GoogleLoginButton align='center' style={{width: '400px', borderRadius:  '10px', margin: '22px 0px'}} onClick={loginWithGoogle}>
				Log in/Register with Google
			</GoogleLoginButton>
		</>
	);
}
