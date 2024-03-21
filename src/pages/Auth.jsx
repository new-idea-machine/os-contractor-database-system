import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Auth() {
  const [credentials, setCredentials] = useState(null);
  const navigate = useNavigate();

  return (
		<>
			<button onClick={() => navigate(-1)}>
				Back
			</button>

      {credentials === null ?
        <Login setCredentials={setCredentials} /> :
        <Register credentials={credentials} setCredentials={setCredentials} />
      }
		</>
  );
}
