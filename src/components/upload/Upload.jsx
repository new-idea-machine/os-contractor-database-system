import { useState, useEffect, useContext } from 'react';
import ProfilePicture from '../ProfilePicture';
import { userProfileContext } from '../../contexts/UserProfileContext';

import { ReactComponent as IconCamera } from "../../assets/icons/cameraWhite.svg";

import './upload.css';

export default function Upload({ setNewImageFile }) {
	const [newImage, setNewImage] = useState(null);
	const { userProfile } = useContext(userProfileContext);

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
			<ProfilePicture profileImage={newImage ? newImage : userProfile?.profileImg} size={200} />
			<IconCamera id='IconCamera' onClick={handleCameraClick} />
			<input id='FilePicker' type='file' style={{display: 'none'}} onChange={handleFileInputChange} />
		</div>
	);
}
