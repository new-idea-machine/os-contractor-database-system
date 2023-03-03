import React, { useContext, useState, useRef } from 'react';
import { authContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import images from '../constants/images';
import Register from './Register';
import { toast } from 'react-toastify';
// import Nav from '../../components/NavBar';

export default function Login() {
	const { login, user } = useContext(authContext);
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const loginPage = useRef();
	const registerPage = useRef();

	const [loginStep, setLoginStep] = useState(loginPage);
	const [registerStep, setRegisterStep] = useState(null);

	const navigate = useNavigate();

	const handleLogin = () => {
		login(loginEmail, loginPassword);
		if (user) {
			toast.info(`welcome! ${user?.displayName}`);
			navigate('/contractorlist');
		}
	};

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

			<div className='appLogin flexCenter'>
				{loginStep && (
					<div className='loginContainer' ref={loginPage}>
						<div className='logoContainer'>
							<img src={images.loginBg} alt='' />
						</div>
						{/* <h2 style={{ color: 'var(--color-golden)' }}> Login </h2> */}
						<div className='fields'>
							<input
								id='emailInput'
								type='email'
								placeholder='Email...'
								onChange={(event) => {
									setLoginEmail(event.target.value);
								}}
							/>
							<input
								type='password'
								placeholder='Password...'
								onChange={(event) => {
									setLoginPassword(event.target.value);
								}}
							/>

							<button onClick={() => handleLogin()}> Login</button>
							{/* <button onClick={() => handleLogOut()}> Logout</button> */}
						</div>
						<div className='optionContainer'>
							<p>Don't have an account?</p>
							<button className='' onClick={handleFormChange}>
								Register
							</button>
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
