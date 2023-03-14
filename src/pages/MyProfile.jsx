import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../contexts/auth';
import ContractorProfile from '../components/ContractorProfile/ContractorProfile';
import { contractorContext } from '../contexts/ContractorContext';
import { toast } from 'react-toastify';

export default function MyProfile() {
	const { user } = useContext(authContext);
	const userUid = user?.uid;
	const { contractorList } = useContext(contractorContext);
	const navigate = useNavigate();
	useEffect(() => {
		if (!user || user === null) {
			toast.error('Please Login To View Profile');
			navigate('/');
		}
	}, []);

	return (
		<>
			{contractorList.length > 0 &&
				contractorList.map((contractor) =>
					userUid === contractor?.firebaseUID ? (
						<>
							<ContractorProfile key={contractor?.id} data={contractor} />
						</>
					) : null
				)}
		</>
	);
}
