import React, { useState } from 'react';
import ProfilePicture from '../ProfilePicture';

import { ReactComponent as IconCamera } from "../../assets/icons/cameraWhite.svg";

import './upload.css';

const avatarURL = "/assets/avatar.svg";

export default function Upload({ setNewImageFile }) {
	const [newImage, setNewImage] = useState(null);

	const handleFileInputChange = (event) => {
		const newFile = event.target.files[0];

		if (newFile) {
			setNewImageFile(newFile);
			setNewImage(URL.createObjectURL(newFile));
		}
	};

	const handleCameraClick = () => {
		const filePickerElement = document.getElementById('FilePicker');

		filePickerElement.dispatchEvent(new MouseEvent('click'));
	}

	return (
		<div>
			<ProfilePicture profileImage={newImage ? newImage : avatarURL} size={200} />
			<IconCamera id='IconCamera' onClick={handleCameraClick} />
			<input id='FilePicker' type='file' style={{display: 'none'}} onChange={handleFileInputChange} />
		</div>
	);
}
