import React, { useContext, useState } from 'react';
import { authContext } from '../contexts/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';
import images from '../constants/images';
import { useEffect } from 'react';
import Login from './Login';
import { toast } from 'react-toastify';
import { Password } from '@mui/icons-material';
import PasswordChecklist from "react-password-checklist";

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
		const strongPasswordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;

		

		if (
			displayName.trim()?.length <= 0 ||
			!strongPasswordRegex.test(registerPassword) ||
			registerEmail.trim()?.length <= 0 ||
			!regEx.test(registerEmail)
		) 
		
		{
			
			if (!strongPasswordRegex.test(registerPassword) ){
        		setRegisterPassword('');
				toast.error('Please enter a password with at least 8 characters, one number, one lowercase, one upper case and one special character');
				return false;
				
	
			}
			else if(displayName.trim()?.length <= 0 ){
			// theDisplayName = "NO DISPLAY NAME PROVIDED";
			setDisplayName('');
			toast.error('Please enter your display name');
			return false;
			
			}

			else if(registerEmail.trim()?.length <= 0 ||
			!regEx.test(registerEmail)) {
			setRegisterEmail('');
			toast.error('Please enter valid email address');
			return false; 
			

			}
			
			//return false;
			
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
								value={registerEmail}
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
								value={displayName}
								name='displayName'
								placeholder='DisplayName...'
								type='text'
								autoComplete='off'
								onChange={(event) => {
									setDisplayName(event.target.value);
								}}
							/>
							<input
								value={registerPassword}
								type='password'
								placeholder='Password...'
								autoComplete='off'
								onChange={(event) => {
									setRegisterPassword(event.target.value);
								}}
							/>
							
							<div className='passwordCheck'>
								<PasswordChecklist
								rules={["minLength","specialChar","number","capital"]}
								minLength={8}
								value={registerPassword}
								onChange={(isValid) => {}}
								/>
							</div>
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
