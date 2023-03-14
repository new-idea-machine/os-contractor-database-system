import React, { useState } from 'react';
import './upload.css';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default function Upload({ setImgUrl, imgUrl }) {
	const [progresspercent, setProgresspercent] = useState(0);
	const [file, setFile] = useState(null);

	const handleSubmitFile = (e) => {
		e.preventDefault();
		// setFile(e.target[0]?.files[0]);
		console.log('!!!', file);
		if (!file) return;
		const storageRef = ref(store, `files/${uuidv4() + file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgresspercent(progress);
			},
			(error) => {
				alert(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
					// handleUpdate(file, downloadURL);
					setImgUrl(downloadURL);

					//   console.log("####", imgUrl)
				});
			}
		);
	};
	return (
		<>
			<div className='upload input' style={{ border: '2px solid white' }}>
				<input type='file' onChange={(e) => setFile(e.target.files[0])} />
				<button onClick={handleSubmitFile}>Upload</button>
			</div>
			{!imgUrl && (
				<div
					className='outerbar'
					style={{
						border: '2px solid white',
						background: 'white',
						width: '200px',
					}}
				>
					<div
						className='innerbar'
						style={{
							width: `${progresspercent}%`,
							background: 'red',
						}}
					>
						{progresspercent}%
					</div>
				</div>
			)}
			{imgUrl && <img src={imgUrl} alt='uploaded file' height={200} />}
		</>
	);
}
