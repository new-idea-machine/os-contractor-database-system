import React from 'react';

import video from '../../assets/work-space.mp4';

import './videoContainer.css';

const VideoContainer = () => {
	const vidRef = React.useRef();

	return (
		<div className='app__video flex__center'>
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
	);
};

export default VideoContainer;
