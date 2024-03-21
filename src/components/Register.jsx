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
    submitEvent.preventDefault();

		const passwordStrength = /^(?=.*[0-9])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;

    const formElements = submitEvent.target.elements;
    const displayName = formElements.DisplayName.value.trim();
    const registerPassword = formElements.Password.value;
    const userType = formElements.userType.value;

    let fieldsAreValid = true;

    if (displayName.length <= 0) {
      toast.error('Please enter your display name');
      fieldsAreValid = false;
    }

    if (!passwordStrength.test(registerPassword)) {
      toast.error('Please enter a password with at least 8 characters, one number, one lowercase, one upper case and one special character');
      fieldsAreValid = false;
    }

    if (userType === '') {
      toast.error('Please select a user type (Recruiter or Contractor)');
      fieldsAreValid = false;
    }

		if (fieldsAreValid) {
      try {
        const success = await register(credentials.email, displayName, registerPassword, userType);

        if (!success) {
          toast.error('The email is already in use');
          setCredentials(null);
        }
        else {
          toast.info(`You have successfully registered with "${credentials.email}"!`);
          navigate('/contractorList');
        }
      } catch (error) {
        console.error(`Error occurred during registration:  ${error.message}`);
        toast.error(error.message);
      }
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
          name='DisplayName'
          placeholder='DisplayName...'
          type='text'
          autoComplete='off'
        /><br />

        <input
          defaultValue={credentials.password}
          name='Password'
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
