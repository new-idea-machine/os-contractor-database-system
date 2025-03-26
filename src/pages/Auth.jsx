import React, { useContext } from 'react';
import { authContext } from '../contexts/Authorization';
import Login from '../components/Login';
import Register from '../components/Register';

import './Auth.css';

import { ReactComponent as BackArrow } from '../assets/icons/backArrow.svg';

export default function Auth() {
	const { credential } = useContext(authContext);

	return (
		<div id="Auth">
			<main>
				<header><h2>CONTRACTOR <b>DB</b></h2></header>

				<section>
					<div>
						{credential === null ? <Login /> : <Register />}

						<p>
							<a href=".."> <BackArrow />{' '}Back to Home page</a>
						</p>
					</div>
				</section>
			</main>
		</div>
	);
}
