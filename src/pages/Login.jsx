import React, { useContext, useState, useRef, useEffect} from 'react';
import { authContext } from '../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import Register from './Register';
import { toast } from 'react-toastify';
import { GoogleLoginButton, TwitterLoginButton } from "react-social-login-buttons";
import { isSignInWithEmailLink } from 'firebase/auth';

// import Nav from '../../components/NavBar';

export default function Login() {

	const { login, loginWithGoogle, loginWithTwitter, signInWithEmail, user } = useContext(authContext);
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const loginPage = useRef();
	const registerPage = useRef();

	const [loginStep, setLoginStep] = useState(loginPage);
	const [registerStep, setRegisterStep] = useState(null);

	const navigate = useNavigate();

	//useEffect(() => {
		//signInWithEmail(); // Call signInWithEmail when the component mounts
	  //}, []);

	const handleLogin = async (submitEvent) => {
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

	const handleGoogleLogin = () => {
		loginWithGoogle();
	};

	const handleTwitterLogin = () => {
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
		<>
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
					<input type='button' value='Forgot password' />
				</form>

				<TwitterLoginButton onClick={() => handleTwitterLogin()}/>
				<GoogleLoginButton onClick={() => handleGoogleLogin()}/>
			</div>
		</>
	);
}
