import React, { useContext, useState, useRef, useEffect} from 'react';
import { authContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { toast } from 'react-toastify';
import { GoogleLoginButton, TwitterLoginButton } from "react-social-login-buttons";
import { getAuth, isSignInWithEmailLink, sendPasswordResetEmail } from 'firebase/auth';

export default function Login() {
	const { login, loginWithGoogle, loginWithTwitter, signInWithEmail, user } = useContext(authContext);
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const loginPage = useRef();

	const [loginStep, setLoginStep] = useState(loginPage);
	const [registerStep, setRegisterStep] = useState(null);

	const navigate = useNavigate();

	async function resetPassword() {
    try {
			const auth = getAuth();
			await sendPasswordResetEmail(auth, loginEmail);
			setLoginEmail('');
			toast.info('Password reset link sent successfully!  Please check your email.');
		} catch (error) {
			toast.info('This e-mail address isn\'t in our system.  You can enter a password now to start registering.');
		}
	};

	async function handleLogin(submitEvent) {
		submitEvent.preventDefault();

		try {
		  const result = await login(loginEmail, loginPassword);

			if (result === 'auth/user-not-found')
				navigate('/register');
		} catch (error) {
			console.log('Error occurred during login:', error.message);
		  setLoginPassword('');
		  setLoginEmail('');
		  toast.error(error.message);
		}
	};

	function handleGoogleLogin() {
		loginWithGoogle();
	};

	function handleTwitterLogin() {
		loginWithTwitter();
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
		<div className='appLogin'>
			<button onClick={() => navigate(-1)}>
				Back
			</button>

			<form onSubmit={(event) => handleLogin(event)}>
				<input
					name='Email'
					type='email'
					placeholder='Email...'
					autoComplete='off'
					value={loginEmail}
					onChange={(event) => setLoginEmail(event.target.value)}
				/><br />

				<input
					name='Password'
					type='password'
					placeholder='Password...'
					autoComplete='off'
					value={loginPassword}
					onChange={(event) => setLoginPassword(event.target.value)}
				/><br />

				<input type='submit' value='Login or Register' />{" "}
				<input type='button' value='Forgot password' onClick={resetPassword}/>
			</form>

			<TwitterLoginButton onClick={() => handleTwitterLogin()}/>
			<GoogleLoginButton onClick={() => handleGoogleLogin()}/>
		</div>
	);
}
