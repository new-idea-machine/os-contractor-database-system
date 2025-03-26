import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { authContext } from '../contexts/Authorization';

import './Home.css';

const videoURL = '/assets/work-space.mp4';

export default function Home() {
	const { user, logout } = useContext(authContext);
	const navigate = useNavigate();

	return (
		<div id="Home">
			<video
				src={videoURL}
				type='video/mp4'
				loop
				controls={false}
				muted
				autoPlay
			/>

			<main>
				<header><h2>CONTRACTOR <b>DB</b></h2></header>

				<section>
					<h1>Welcome to our contractor database system,</h1>
					<p>
						a software application that enables users to store, manage, and
						access information related to contractors.
					</p>
					{user === null ?
						<button onClick={() => navigate('auth')}>
							<span>Log In or Register</span>
						</button> :
						user && <button onClick={() => logout()}>
							<span>Logout</span>
						</button>
					}
				</section>

				<footer><h3>CONTRACTOR <b>DB</b></h3></footer>
				<footer>&copy; New Idea Machine 2023. All rights reserved.</footer>
			</main>
		</div>
	);
}
