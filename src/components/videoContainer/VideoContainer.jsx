import React, { useContext, useEffect, useState } from 'react';
import video from '../../assets/work-space.mp4';
// import { BsFillPlayFill, BsPauseFill } from 'react-icons/bs';
// import { meal } from '../../constants';
import { useNavigate } from 'react-router-dom';
import './videoContainer.css';
import { authContext } from '../../contexts/auth';
// import ActionBar from '../../components/actionBar/ActionBar';

const VideoContainer = () => {
	const { user, logout } = useContext(authContext);
	// const [playVideo, setPlayVideo] = useState(false);
	const navigate = useNavigate();
	const vidRef = React.useRef();

	// const handleVideo = () => {
	// 	setPlayVideo((prevPlayVideo) => !prevPlayVideo);
	// 	if (playVideo) {
	// 		vidRef.current.pause();
	// 	} else {
	// 		vidRef.current.play();
	// 	}
	// };

	return (
		<div className='app__video flex__center'>
			<div>
				<video
					className='app__video-position'
					ref={vidRef}
					src={video}
					type='video/mp4'
					loop
					controls={false}
					muted
					autoPlay
				/>
			</div>
			<div className='app__video-overlay flexCenter'>
				{/* <div className=' ' onClick={handleVideo}> */}
				{/* <h1 className='headtext__cormorant'>Welcome</h1> */}
				{/* <ActionBar /> */}
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
				{user && (
					<div className='customButton4' onClick={() => logout()}>
						<span>Logout</span>
					</div>
				)}
				{/* {playVideo ? (
          <BsPauseFill color='#fff' fontSize={30}/>
        ) : <BsFillPlayFill color='#fff' fontSize={30}/>} */}
				{/* </div> */}
			</div>
		</div>
	);
};

export default VideoContainer;
