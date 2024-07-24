import React, { useState, useContext } from 'react';
import './upload.css';
import { contractorContext } from '../../contexts/ContractorContext';
import ProfilePicture from '../ProfilePicture';

import { ReactComponent as IconCamera } from "../../assets/icons/cameraWhite.svg";

const avatarURL = "/assets/avatar.svg";

export default function Upload({ newImage, setNewImage, setNewImageFile }) {
	const { updateTechObject, currentUserProfile } =
		useContext(contractorContext);
	const [progresspercent, setProgresspercent] = useState(0);
	const [previewUrl, setPreviewUrl] = useState(null);

	const handleFileInputChange = (event) => {
		const newFile = event.target.files[0];

		if (newFile) {
			setNewImageFile(newFile);
			setNewImage(URL.createObjectURL(newFile));
		}
	};

	// const onSubmit = (url) => {
	// 	// e.preventDefault();
	// 	const data = {
	// 		id: currentUserProfile?.id,
	// 		profileImg: url || currentUserProfile?.profileImg,
	// 	};
	// 	console.log(data);
	// 	updateTechObject(data);
	// };
	//
	// const handleSubmitFile = (e) => {
	// 	e.preventDefault();
	// 	console.log('!!!', file);
	// 	if (!file) return;
	// 	const storageRef = ref(store, `files/${uuidv4() + file.name}`);
	// 	const uploadTask = uploadBytesResumable(storageRef, file);
	// 	uploadTask.on(
	// 		'state_changed',
	// 		(snapshot) => {
	// 			const progress = Math.round(
	// 				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
	// 			);
	// 			setProgresspercent(progress);
	// 		},
	// 		(error) => {
	// 			alert(error);
	// 		},
	// 		() => {
	// 			getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
	// 				setImgUrl(downloadURL);
	// 				setPreviewUrl(null);
	// 				onSubmit(downloadURL);
	// 				setProgresspercent(0);
	// 			});
	// 		}
	// 	);
	// };
	return (
		<div>
			<ProfilePicture profileImage={newImage ? newImage : avatarURL} size={200} />
			<IconCamera 
				style={{color: "var(--card-colour)"}}
				onClick={() => {
					const filePickerElement = document.getElementById('FilePicker');
					filePickerElement.dispatchEvent(new MouseEvent('click'));
				}}
			/>
			<input id='FilePicker' type='file' style={{display: 'none'}} onChange={handleFileInputChange} />
		</div>
	);
}
