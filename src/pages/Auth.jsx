import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../contexts/Authorization';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Auth() {
	const navigate = useNavigate();
	const { credential } = useContext(authContext);

	console.log(`Rendering Auth page ("credential" is ${credential === null ? "" : "not "}null)`);

	return (
		<>
			<button onClick={() => navigate(-1)}>
				Back
			</button>

			{credential === null ? <Login /> : <Register />}
		</>
  );
}
