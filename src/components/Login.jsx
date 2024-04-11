import React, { useContext, useState, useRef, useEffect} from 'react';
import { authContext } from '../contexts/Authorization';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import { toast } from 'react-toastify';
import { GoogleLoginButton, TwitterLoginButton } from "react-social-login-buttons";
import { getAuth, isSignInWithEmailLink, sendPasswordResetEmail } from 'firebase/auth';

export default function Login({ setCredentials }) {
	const { login, loginWithGoogle, loginWithTwitter, signInWithEmail, user } = useContext(authContext);
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
          setCredentials({ email, password });
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
			<form onSubmit={(event) => handleEmailLogin(event)}>
				<input
					name='Email'
					type='email'
					placeholder='Email...'
					autoComplete='off'
				/><br />

				<input
					name='Password'
					type='password'
					placeholder='Password...'
					autoComplete='off'
				/><br />

				<input type='submit' value='Login or Register' />{' '}
				<input type='button' value='Forgot password' onClick={resetPassword}/>
			</form>

			<TwitterLoginButton onClick={() => handleTwitterLogin()}/>
			<GoogleLoginButton onClick={() => handleGoogleLogin()}/>
		</div>
	);
}
