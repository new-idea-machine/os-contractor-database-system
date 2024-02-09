import React from 'react';

import video from '../../assets/work-space.mp4';

import './videoContainer.css';

function VideoContainer() {
	return (
		<video
			src={video}
			type='video/mp4'
			loop
			controls={false}
			muted
			autoPlay
		/>
	);
};

export default VideoContainer;
