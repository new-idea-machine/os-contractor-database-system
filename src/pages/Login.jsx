import React, { useContext, useState, useRef, useEffect} from 'react';
import { authContext } from '../contexts/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/auth.css';
import images from '../constants/images';
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

	const handleLogin = async () => {
		try {
		  await login(loginEmail, loginPassword);
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
		if ( user?.displayName) {
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
	  }, [user, navigate]);

	  useEffect(() => {
		const currentLoginStep = loginStep?.current;
		const currentRegisterStep = registerStep?.current;
		const isLoginPage = currentLoginStep && currentLoginStep.contains(document.activeElement);
		const isRegisterPage = currentRegisterStep && currentRegisterStep.contains(document.activeElement);
	
		if (!user && isLoginPage) {
		  toast.error('Invalid login credentials!');
		}
	  }, [user, loginStep, registerStep]);

	// const handleLogOut = () => {
	// 	logout();
	// 	navigate('/');
	// };

	const handleFormChange = () => {
		setLoginStep(null);
		setRegisterStep(registerPage);
	};
	// if (!user)
	return (
		<>
			{/* <Nav noneLinks={'none'} noneLogin={'none'} /> */}
			{/* <div className=''> */}
			<div className='backButton'>
				<div className='customButton2' onClick={() => navigate(-1)}>
					Back
				</div>
			</div>

			<div className='appLogin'>
				{loginStep && (
					<div className='loginContainer' ref={loginPage}>
						<div className='boxAuthTop flexCenter'>
							<div className='logoContainer'>
								<img src={images.team} alt='' />
							</div>
						</div>
						<div className='boxAuth'>
							{/* <h2 style={{ color: 'var(--color-golden)' }}> Login </h2> */}
							<div className='fields'>
								<input
									id='emailInput'
									type='email'
									placeholder='Email...'
									autoComplete='off'
									value={loginEmail}
									onChange={(event) => {
										setLoginEmail(event.target.value);
									}}
								/>
								<input
									type='password'
									placeholder='Password...'
									autoComplete='off'
									value={loginPassword}
									onChange={(event) => {
										setLoginPassword(event.target.value);
									}}
								/>

								<button onClick={() => handleLogin()}> Login</button>
								<TwitterLoginButton style={{margin: '10px', borderRadius: '5px'}} onClick={() => handleTwitterLogin()}/> 
								<GoogleLoginButton style={{marginLeft:'20px', marginRight: '20px', marginTop: '5px', marginBottom:'10px', borderRadius: '5px'}} onClick={() => handleGoogleLogin()}/>
								{/* <button onClick={() => handleLogOut()}> Logout</button> */}
								<Link to='/forgotPassword'>Forgot password?</Link>
							</div>
							<div className='optionContainer'>
								<p style={{ color: 'black' }}>Don't have an account?</p>
								<button className='' onClick={handleFormChange}>
									<span style={{ textDecoration: 'underline' }}>Register</span>
								</button>
							</div>
						</div>
					</div>
				)}
				{registerStep && (
					<div className='optionContainer' ref={registerPage}>
						{
							<Register
								loginPage={loginPage}
								setLoginStep={setLoginStep}
								setRegisterStep={setRegisterStep}
							/>
						}
					</div>
				)}
			</div>

			{/* </div> */}
		</>
	);
}
