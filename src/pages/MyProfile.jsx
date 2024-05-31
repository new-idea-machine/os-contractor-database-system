import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../contexts/Authorization';
import ContractorProfile from '../components/ContractorProfile/ContractorProfile';
import RecruiterProfile from '../components/RecruiterProfile/RecruiterProfile';
import { contractorsContext } from '../contexts/ContractorsContext';
import { recruiterContext } from "../contexts/RecruiterContext";
import { toast } from 'react-toastify';
import { Navigation } from '../components';

export default function MyProfile() {
	const { user } = useContext(authContext);
	const userUid = user?.uid;
	const contractorList = useContext(contractorsContext);
	const { currentUserProfile } = useContext(recruiterContext);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user || user === null) {
			toast.error('Please Login To View Profile');
			navigate('/');
		}
	}, []);

	return (
		<>
			<Navigation menu="Profile" />
			<main>
			{userUid && contractorList.length > 0 && (
				<>
					{contractorList.map((contractor, index) => {
						if (userUid === contractor?.firebaseUID) {
							return (
								<div key={index}>
									<ContractorProfile data={contractor} />
								</div>
							);
						}
						return null;
					})}

					{currentUserProfile && (
						<div>
							<RecruiterProfile data={currentUserProfile} />
						</div>
					)}
				</>
			)}
			</main>
		</>
	);
}
