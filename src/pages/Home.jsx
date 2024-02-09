import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { authContext } from '../contexts/auth';
import VideoContainer from '../components/videoContainer/VideoContainer';

import './Home.css';

export default function Home() {
	const { user, logout } = useContext(authContext);
	const navigate = useNavigate();

	return (
		<>
			<VideoContainer />

			<main>
				<header><h2>CONTRACTOR DB</h2></header>
				<section>
					<h1>Welcome to our contractor database system,</h1>
					<p>
						a software application that enables users to store, manage, and
						access information related to contractors.
					</p>
					{user ?
						<div className='customButton4' onClick={() => navigate('auth')}>
							<span>Log In Or Sign Up</span>
						</div> :
						<div className='customButton4' onClick={() => logout()}>
							<span>Logout</span>
						</div>
					}
				</section>
				<footer><h3>CONTRACTOR DB</h3></footer>
				<footer>&copy; New Idea Machine 2023. All rights reserved.</footer>
			</main>
		</>
	);
}
