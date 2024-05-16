import React, { useContext, useState } from 'react';
import { authContext } from '../contexts/Authorization';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PasswordChecklist from "react-password-checklist";

export default function Register() {
	const { credential, setCredential, register } = useContext(authContext);
	const [registerPassword, setRegisterPassword] = useState(credential.password || "");

	const navigate = useNavigate();

	async function handleRegistrationFormSubmit(event) {
		event.preventDefault();

		const passwordStrength = /^(?=.*[0-9])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/;

		const formElements = event.target.elements;
		const displayName = formElements.DisplayName.value.trim();
		const registerPassword = formElements?.Password?.value;
		const userType = formElements.userType.value;

		let fieldsAreValid = true;

		if (displayName.length <= 0) {
			toast.error('Please enter your display name');
			fieldsAreValid = false;
		}

		if (credential?.password && !passwordStrength.test(registerPassword)) {
			toast.error('Please enter a password with at least 8 characters, one number, one lowercase, one upper case and one special character');
			fieldsAreValid = false;
		}

		if (userType === '') {
			toast.error('Please select a user type (Recruiter or Contractor)');
			fieldsAreValid = false;
		}

		if (fieldsAreValid) {
			try {
				const success = await register(displayName, registerPassword, userType);

				if (!success) {
					toast.error('This email is already in use');
					setCredential(null);
				}
				else {
					toast.info(`You have successfully registered as "${credential.email}"!`);
					navigate('/UpdateProfile');
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
				{credential?.email ?
					<>
						{credential?.providerId ? <><b>{credential.providerId}</b> user</> : "User"}{' '}
						<b>"{credential.email}"</b>{' '}
						isn&apos;t registered.
					</> :
					<>
						These credentials aren't for a registered user.
					</>
				}
			</p>

			<button onClick={() => setCredential(null)}>
				Log in with different credentials
			</button>

			<p className="splitBar">
				or
			</p>

			<p>
				Provide the following information to complete your registration:
			</p>

			<form onSubmit={(event) => handleRegistrationFormSubmit(event)}>
				<input
					defaultValue={credential?.displayName || ''}
					name='DisplayName'
					placeholder='Display name'
					type='text'
					autoComplete='off'
				/>

				{credential?.password &&
					<>
						<input
							defaultValue={credential?.password}
							name='Password'
							type='password'
							placeholder='Password...'
							autoComplete='off'
							onChange={(event) => {
							setRegisterPassword(event.target.value);
						}}
						/>

						<div className='passwordCheck'>
							<PasswordChecklist
								rules={['minLength','specialChar','number','capital']}
								minLength={8}
								value={registerPassword}
							/>
						</div>
					</>
				}

				<p>
					You are a:{' '}

					<input
						type='radio'
						name='userType'
						value='recruiter'
					/>{' '}
					<label>Recruiter</label>{' '}

					<input
						type='radio'
						name='userType'
						value='techs'
					/>{' '}
					<label>Contractor</label>
				</p>

			        <input type='submit' value='Register new user' />
      			</form>
		</>
	);
}
