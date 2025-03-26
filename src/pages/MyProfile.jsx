import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../contexts/Authorization';
import ContractorProfile from '../components/ContractorProfile/ContractorProfile';
import RecruiterProfile from '../components/RecruiterProfile/RecruiterProfile';
import { userProfileContext } from '../contexts/UserProfileContext';
import { toast } from 'react-toastify';
import { Navigation } from '../components';

export default function MyProfile() {
	const { user } = useContext(authContext);
	const { userProfile } = useContext(userProfileContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (user === null) {
			toast.error('Please Login To View Profile');
			navigate('/');
		}
	}, [user]);

	return (
		<>
			<Navigation menu="Profile" />
			<main>
				{(userProfile?.userType === 'techs') && <ContractorProfile data={userProfile} />}
				{(userProfile?.userType === 'recruiter') && <RecruiterProfile data={userProfile} />}
			</main>
		</>
	);
}
