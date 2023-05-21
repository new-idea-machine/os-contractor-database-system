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
	const [userType, setUserType] = useState('');
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
			registerPassword.trim()?.length <= 5 ||
			registerEmail.trim()?.length <= 0 ||
			!regEx.test(registerEmail)
		) {
			// theDisplayName = "NO DISPLAY NAME PROVIDED";
			toast.error('A Display Name with valid email address and password must be entered');
			setDisplayName('');
			setRegisterEmail('');
			setErroMessage(
				'Display name, password and/or email address are not provided or invalid'
			);
			return false;
		} else {
			let success = register(
				registerEmail,
				displayName.trim(),
				registerPassword,
				userType
			);
			if (!success) {
				setErroMessage('Registration Failed');
				return errorMessage;
			} else {
				setErroMessage(
					`A login email link sent to ${registerEmail}, please check your email`
				);
				toast.info(`You Have successfully registered with ${registerEmail} !!`);
				navigate('/contractorlist');
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
			<div className='appLogin'>
				<div className='loginContainer'>
					<div className='boxAuthTop flexCenter'>
						<div className='logoContainer'>
							<img src={images.team} alt='' />
						</div>
					</div>
					<div className='boxAuth'>
						<div className='fields2'>
							<input
								id='emailInput'
								type='email'
								name='email'
								placeholder='Email...'
								autoComplete='off'
								onChange={(event) => {
									setRegisterEmail(event.target.value);
								}}
							/>
							<input
								name='displayName'
								placeholder='DisplayName...'
								type='text'
								autoComplete='off'
								onChange={(event) => {
									setDisplayName(event.target.value);
								}}
							/>
							<input
								type='password'
								placeholder='Password...'
								autoComplete='off'
								onChange={(event) => {
									setRegisterPassword(event.target.value);
								}}
							/>

							<button id='regButton' onClick={() => nameEmailValidation()}>
								{' '}
								Create User
							</button>
							<div
								style={{
									color: 'black',
									fontSize: '16px',
									marginTop: '5px',
								}}
							>
								Are you a Recruiter ?
							</div>
							<div
								style={{
									display: 'flex',
									flexDirection: 'row',
									gap: '10px',
									marginTop: '5px',
								}}
							>
								<input
									style={{
										boxShadow: 'none',
										cursor: 'pointer',
										width: '20px',
										height: '20px',
									}}
									type='checkbox'
									name='recruiter'
									// placeholder='Yes'
									value='recruiter'
									// autoComplete='off'
									onChange={(event) => {
										setUserType(event.target.value);
									}}
								/>
								<label style={{ color: 'black' }}>Yes</label>
							</div>
						</div>
						<div className='optionContainer'>
							<div style={{ color: 'black' }}>Already have an account ?</div>
							<button className='' onClick={handleFormChange}>
								<span style={{ textDecoration: 'underline' }}>Login</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
