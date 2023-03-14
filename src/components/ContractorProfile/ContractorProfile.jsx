import React, { useContext } from 'react';
import './ContractorProfile.css';
import { useParams, useNavigate } from 'react-router-dom';
import { contractorContext } from '../../contexts/ContractorContext';
import { Footer, Navigation } from '../index';
import { authContext } from '../../contexts/auth';

const ContractorProfile = (props) => {
	const { id } = useParams();
	const { contractorList } = useContext(contractorContext);

	return (
		<div>
			<Navigation />
			{contractorList.map((contractor) =>
				id === contractor?.id || props?.data?.id === contractor?.id ? (
					<div className='contractor_profile' key={contractor.id}>
						<div className='image_wrapper'>
							<img src={contractor?.profileImg} alt='Contractor headshot' />
						</div>
						<div className='contractor_info'>
							<div className='contractor_name'>{contractor?.name}</div>
							<a
								style={{ marginBottom: '10px' }}
								href={`mailto:${contractor?.email}`}
								target='_blank'
								rel='noopener noreferrer'
							>
								{contractor?.email}
							</a>
							{contractor?.otherInfo?.githubUrl && (
								<a
									href={contractor?.otherInfo?.githubUrl}
									target='_blank'
									rel='noopener noreferrer'
								>
									GitHub
								</a>
							)}
							{contractor?.otherInfo?.linkedinUrl && (
								<a
									style={{ marginBottom: '10px' }}
									href={contractor?.otherInfo?.linkedinUrl}
									target='_blank'
									rel='noopener noreferrer'
								>
									LinkedIn
								</a>
							)}
							{contractor?.projects && (
								<div>
									Projects:{' '}
									{contractor?.projects.map((project) => (
										<div
											key={project.id}
											style={{
												backgroundColor: '#D5D1D0',
												marginTop: '5px',
												marginBottom: '5px',
												borderRadius: '5px',
												padding: '5px',
											}}
										>
											<div>Project Name: {project?.projectName}</div>
											<div>Project Description: {project?.description}</div>
										</div>
									))}
								</div>
							)}
							{contractor?.resume && (
								<a
									style={{
										cursor: 'pointer',
										margin: '0',
										border: '0',
										padding: '0',
										width: '200px',
									}}
									href={contractor?.resume}
									target='_blank'
									rel='noopener noreferrer'
								>
									Download Resume
								</a>
							)}
						</div>
					</div>
				) : null
			)}
			<Footer />
		</div>
	);
};

export default ContractorProfile;
