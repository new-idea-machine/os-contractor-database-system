import React from 'react';
import './profile.css';

export default function ProfileForm() {
	return (
		<>
			<div className='updateForm flexCenter'>
				<form className='flexCenter'>
					<h1>Update Profile</h1>
					<div className='formSection flexCenter'>
						<h3>Personal Info</h3>
						<input name='test' placeholder='Test' />
						<input name='test' placeholder='Test' />
						<input name='test' placeholder='Test' />
					</div>
					<div className='formSection flexCenter'>
						<h3>Technical Info</h3>
						<input name='test' placeholder='Test' />
						<input name='test' placeholder='Test' />
						<input name='test' placeholder='Test' />
					</div>
					<div className='formSection flexCenter'>
						<h3>Other Info</h3>
						<input name='test' placeholder='Test' />
						<input name='test' placeholder='Test' />
						<input name='test' placeholder='Test' />
					</div>
					<button className='customButton' type='submit'>
						<span>Update</span>
					</button>
				</form>
			</div>
		</>
	);
}
