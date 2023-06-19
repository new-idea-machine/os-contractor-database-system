import React, { useEffect, useState, useContext, useRef } from 'react';
import './profile.css';
import { authContext } from '../../contexts/auth';
import { recruiterContext } from '../../contexts/RecruiterContext';
import { RecDataSchema, recFormInputs } from '../../constants/data';
import InputSection from '../inputSection/InputSection';
import { Routes, Route, useNavigate } from 'react-router-dom';



export default function RecruiterProfileForm(props) {
	const navigate = useNavigate();

	const { user } = useContext(authContext);

    const {
		updateRecObject,
		currentUserProfile,
		matchProfileToCurrentUser,
		recruiterMap,
		getFirestore
	} = useContext(recruiterContext);

	const [initialFormData, setInitialFormData] = useState(RecDataSchema);
	


	useEffect(() => {
        matchProfileToCurrentUser();
		if (currentUserProfile) {
		  setInitialFormData((prevState) => ({
			...prevState,
			email: currentUserProfile.email || '',
			firstName: currentUserProfile.firstName || '',
			id: currentUserProfile.id,
			lastName: currentUserProfile.lastName || '',
			qualification: currentUserProfile.qualification || '',
			linkedinUrl: currentUserProfile.linkedinUrl || '',
            companyName: currentUserProfile.companyName || '',
			companyInfo: currentUserProfile.companyInfo || '',
			phone: currentUserProfile.phone || '',
			
		  }));
		  
		  
		  
		} 
	  }, [currentUserProfile]);


	const form = useRef();

	const onChange = (e) => {
		const { name, value } = e.target;
		setInitialFormData((prevState) => ({ ...prevState, [name]: value }));
		
	  };

	const onSubmit = (e) => {
		e.preventDefault();
		const data = {
			email:  initialFormData?.email || '',
			firstName: initialFormData?.firstName ||'',
			id: currentUserProfile?.id,
			lastName: initialFormData?.lastName || '',
			qualification: initialFormData?.qualification ||  '',
			linkedinUrl: currentUserProfile?.linkedinUrl || initialFormData.linkedinUrl,
				
				//resume: currentUserProfile?.resume || initialFormData?.resume,
			
            companyName: initialFormData?.companyName || '',
			companyInfo: initialFormData?.companyInfo || '',
			phone: initialFormData?.phone || '',
			
			           
			
			
		};
		console.log(data);
		updateRecObject(data, () => {
			
			navigate('/myProfile');
		  });
	};

	
	return (
		<>
			{currentUserProfile && (
                
				<div className='updateForm flexCenter'>
                    <h1>recruiter</h1>
					<form className='flexCenter' ref={form} onSubmit={onSubmit}>
						<div className='formContainer'>
							{recFormInputs?.map((section) => (
								<div key={section?.sectionTitle} className='formSection '>
									<h3>{section?.sectionTitle}</h3>
									{section?.fields?.map((field) => (
										<InputSection
											key={field?.name}
											value={initialFormData[field?.name] || ''}
											field={field}
											onChange={onChange}
										/>
									))}
								</div>
							))}
							{/* </div>
						<div className='flexCenter formContainer'> */}
							

							
						</div>
						<button className='customButton' type='submit'>
							<span>Save</span>
						</button>
					</form>
					
				</div>
			)}
		</>
	);
}
