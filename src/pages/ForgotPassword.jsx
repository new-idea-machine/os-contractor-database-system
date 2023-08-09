import React, { useContext, useState, useRef, useEffect} from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate, Link} from 'react-router-dom';
export default function ForgotPassword(){

const navigate = useNavigate();
const [email, setEmail] = useState('');
const [successMessage, setSuccessMessage] = useState('');
const resetPassword  =async () =>{
    try {
        const auth = getAuth(); 
        await sendPasswordResetEmail(auth, email);
        setEmail('');
        setSuccessMessage('Password reset link sent successfully! Please check your email');
      } catch (error) {
        // An error occurred while sending the password reset email
        // You can show an error message or handle the error as per your requirement
      }
    };




    return (
        <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div className='fields'>
            <p style={{ margin:'10px' }}>Enter your email:</p>
			<input id='emailInput' type='email'	placeholder='Email...' autoComplete='off' value={email} onChange={(event) => setEmail(event.target.value)}/>
			<button onClick={() => resetPassword()}> Reset password</button>						
								
        </div>
         
      {successMessage && (
        <>
          <p style={{ margin: '10px' }}>{successMessage}</p>
          <Link onClick={() => navigate(-1)}>Go back to login page</Link>
        </>
      )}
    
        
				
		</div>
       
        </>
    )
}
