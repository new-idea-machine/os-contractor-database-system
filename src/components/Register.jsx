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

export default function Register({ credentials, setCredentials }) {
	const { register, user, logout, signInWithEmail } = useContext(authContext);
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerPassword, setRegisterPassword] = useState(credentials.password);
	const [displayName, setDisplayName] = useState('');
	const [userType, setUserType] = useState('');
	// const [registrationRunning, setRegistrationRunning] = useState(false);
	const [errorMessage, setErroMessage] = useState();

	const navigate = useNavigate();

	async function handleEmailRegistration(submitEvent) {
		const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g; //regex for email address
		const strongPasswordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;

    submitEvent.preventDefault();

    const formElements = submitEvent.target.elements;


		if (
			!strongPasswordRegex.test(registerPassword) ||
			registerEmail.trim()?.length <= 0 ||
			userType.trim()=== '' ||
			!regEx.test(registerEmail)

		)

		{
			if(registerEmail.trim()?.length <= 0 ||
			!regEx.test(registerEmail)) {
			setRegisterEmail('');
			toast.error('Please enter valid email address');
			return false;
			}

			else if (!strongPasswordRegex.test(registerPassword) ){
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


			else if (userType.trim() === '') {
				toast.error('Please select a user type (Recruiter or Contractor)');
				return false;
			  }


			//return false;

		} else {
			const success = await register(
				registerEmail,
				displayName.trim(),
				registerPassword,
				userType
			);
			console.log(userType, registerEmail);
			console.log('Success==> ', success);
			if (!success) {
				toast.error('The email is already in use')
				setErroMessage('Registration Failed');
				return false;
			} else if(success) {

				toast.info(`You Have successfully registered with ${registerEmail} !!`);
				navigate('/contractorList');
			}
			return true;
		}
	};

	return (
		<>
			<p>
        "{credentials.email}" isn&apos;t a registered user.
      </p>

      <div>
        <p>Already have an account ?</p>

        <button onClick={() => setCredentials(null)}>
          Login with Different Credentials
        </button>
      </div>

      <form onSubmit={(event) => handleEmailRegistration(event)}>
        {/* <input
								value={registerEmail}
								id='emailInput'
								type='email'
								name='email'
								placeholder='Email...'
								autoComplete='off'
								onChange={(event) => {
									setRegisterEmail(event.target.value);
								}}
							/> */}

        <input
          defaultValue={displayName}
          name='displayName'
          placeholder='DisplayName...'
          type='text'
          autoComplete='off'
        /><br />

        <input
          defaultValue={credentials.password}
          type='password'
          placeholder='Password...'
          autoComplete='off'
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        /><br />

							<div className='passwordCheck'>
								<PasswordChecklist
								rules={["minLength","specialChar","number","capital"]}
								minLength={8}
								value={registerPassword}
								onChange={(isValid) => {}}
								/>
							</div>

        {/* <button id='regButton' onClick={() => nameEmailValidation()}>
								{' '}
								Create User
							</button> */}

        <p>
          You are a:
        </p>

        <div>
								<input
																		type='radio'
									name='userType'
									// placeholder='Yes'
									value='recruiter'
									// autoComplete='off'
																	/>
								<label>Recruiter</label>

								<input
																		type='radio'
									name='userType'
									// placeholder='Yes'
									value='techs'
									// autoComplete='off'
									/>
								<label>Contractor</label>
          </div>

        <input type='submit' value='Register New User' />
      </form>
		</>
	);
}
