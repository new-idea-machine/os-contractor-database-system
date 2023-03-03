import React, { useContext, useState } from 'react';
import { authContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import images from '../constants/images';
import { useEffect } from 'react';
import Login from './Login';
import { toast } from 'react-toastify';

export default function Register({ loginPage, setLoginStep, setRegisterStep }) {
	const { register, user, logout } = useContext(authContext);
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [displayName, setDisplayName] = useState('');
	// const [registrationRunning, setRegistrationRunning] = useState(false);
	const [errorMessage, setErroMessage] = useState();

	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (!loginPage) {
	// 		setLoginStep(<Login />);
	// 	}
	// }, []);

	const nameEmailValidation = () => {
		const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g; //regex for email address

		if (
			displayName.trim()?.length <= 0 ||
			registerEmail.trim()?.length <= 0 ||
			!regEx.test(registerEmail)
		) {
			// theDisplayName = "NO DISPLAY NAME PROVIDED";
			toast.error('A Display Name with valid email address must be entered');
			setDisplayName('');
			setRegisterEmail('');
			setErroMessage(
				'Display name and/or email address are not provided or invalid'
			);
			return false;
		} else {
			let success = register(
				registerEmail,
				displayName.trim(),
				registerPassword
			);
			if (!success) {
				setErroMessage('Registration Failed');
				return errorMessage;
			} else {
				setErroMessage(
					`A login email link sent to ${registerEmail}, please check your email`
				);
				alert(`You Have successfully registered with ${registerEmail} !!`);
				navigate('/booking');
			}
			return true;
		}
	};

	const handleFormChange = () => {
		setLoginStep(loginPage);
		setRegisterStep(null);
	};

	return (
		<>
			<div className='appLogin flexCenter'>
				<div className='loginContainer'>
					<div className='logoContainer'>
						<img src={images.loginBg} alt='' />
					</div>
					{/* <h2 style={{ color: 'var(--color-golden)' }}> Register </h2> */}
					<div className='fields2'>
						<input
							id='emailInput'
							type='email'
							placeholder='Email...'
							onChange={(event) => {
								setRegisterEmail(event.target.value);
							}}
						/>
						<input
							placeholder='DisplayName...'
							onChange={(event) => {
								setDisplayName(event.target.value);
							}}
						/>
						<input
							type='password'
							placeholder='Password...'
							onChange={(event) => {
								setRegisterPassword(event.target.value);
							}}
						/>

						<button id='regButton' onClick={() => nameEmailValidation()}>
							{' '}
							Create User
						</button>
						{/* <button onClick={() => navigate('/login')}>LogIn</button> */}
					</div>
					<div className='optionContainer'>
						<p>Already have an account?</p>
						<button className='' onClick={handleFormChange}>
							Login
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
