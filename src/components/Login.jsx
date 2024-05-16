import React, { useContext, useState, useRef, useEffect } from 'react';
import { authContext } from '../contexts/Authorization';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GoogleLoginButton, XLoginButton } from 'react-social-login-buttons';
import { getAuth, isSignInWithEmailLink, sendPasswordResetEmail } from 'firebase/auth';

export default function Login() {
	const { setCredential, login, loginWithGoogle, loginWithTwitter, signInWithEmail, user } = useContext(authContext);
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const loginPage = useRef();

	const [loginStep, setLoginStep] = useState(loginPage);
	const [registerStep, setRegisterStep] = useState(null);

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
				setLoginEmail('');
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
		  toast.info(`Welcome! ${user?.displayName}`);
		}
		else{
			if(isSignInWithEmailLink(authContext, window.location.href)){
				console.log("location--> ",window.location.href);
				console.log("sign in with link?--> ", isSignInWithEmailLink);
				const email = localStorage.getItem('email');
				if(!email){
					email= window.prompt('Please provide your email');
				}
				signInWithEmail();
			}
		}
	  }, [user, navigate, signInWithEmail]);

	  useEffect(() => {
		const currentLoginStep = loginStep?.current;
		const currentRegisterStep = registerStep?.current;
		const isLoginPage = currentLoginStep && currentLoginStep.contains(document.activeElement);
		const isRegisterPage = currentRegisterStep && currentRegisterStep.contains(document.activeElement);

		if (!user && isLoginPage) {
		  toast.error('Invalid login credentials!');
		}
	  }, [user, loginStep, registerStep]);

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
