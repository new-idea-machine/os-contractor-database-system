import React, { useContext } from 'react';
import { authContext } from '../contexts/Authorization';
import Login from '../components/Login';
import Register from '../components/Register';

import '../styles/auth.css';

export default function Auth() {
	const { credential } = useContext(authContext);

	console.log(`Rendering Auth page ("credential" is ${credential === null ? "" : "not "}null)`);

	return (
		<div id="Auth">
			<main>
				<header><h2>CONTRACTOR <b>DB</b></h2></header>

				<section>
					<div>
						{credential === null ? <Login /> : <Register />}

						<p>
							<a href=".."> &larr; Back to Home Page</a>
						</p>
					</div>
				</section>
			</main>
		</div>
	);
}
