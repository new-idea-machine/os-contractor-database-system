import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoContainer from '../components/videoContainer/VideoContainer';

export default function Home() {
	const navigate = useNavigate();
	return (
		<>
			<VideoContainer />
			{/* <div className='homePage flexCenter'>
				<h1 style={{ textAlign: 'center', color: 'white' }}>
					Welcome to our contractor database system, which is a software
					application that enables users to store, manage, and access
					information related to contractors.
				</h1>
				<div
					className='customButton4'
					onClick={() => navigate('contractorlist')}
				>
					<span>Continue</span>
				</div>
			</div> */}
		</>
	);
}
