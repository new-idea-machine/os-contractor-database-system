import { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { store } from '../../firebaseconfig';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import styles from './ProfileForm.module.css';
import { userProfileContext } from '../../contexts/UserProfileContext';
import { enforceSchema, techDataSchema } from '../../constants/data';
import Upload from '../upload/Upload';
import InputSection from '../inputSection/InputSection';
import ChangePassword from '../ChangePassword';
import DeleteAccount from '../DeleteAccount';
import { useNavigate } from 'react-router-dom';
import ResponsiveGrid from '../ResponsiveGrid';
import Badge from '../Badge';

export default function ProfileForm(props) {
	const navigate = useNavigate();

	const { updateUserProfile, userProfile } = useContext(userProfileContext);

	const [newImageFile, setNewImageFile] = useState(null);
	const [videoFile, setVideoFile] = useState(null);
	const [newVideoFile, setNewVideoFile] = useState(null);
	const [status, setStatus] = useState('');
	const [uploadProgress, setUploadProgress] = useState(0);
	const initialFormData = enforceSchema(userProfile ? structuredClone(userProfile) : {}, techDataSchema);
	const [skills, setSkills] = useState(initialFormData.skills);
	const [projects, setProjects] = useState(initialFormData.projects);

	const deleteSkill = (index) => {
		setSkills((prevSkills) => {
		  const newSkills = [...prevSkills];
		  newSkills.splice(index, 1); // Remove the skill at the specified index
		  return newSkills;
		});
	  };

	  const deleteProject = (index) => {
		setProjects((prevProjects) => {
			const newProjects = [...prevProjects];
			newProjects.splice(index, 1);

			return newProjects;
		});
	  };

	const addSkill = () => {
		const newSkill = window.prompt('Enter a skill:');

		if (newSkill && !skills.find((skill) => skill.skill === newSkill)) {
			setSkills((prevSkills) => [...prevSkills, { skill: newSkill }]);
		}
	};

	const addProject = () => {
		setProjects((prevProjects) => [
			...prevProjects,
			enforceSchema({}, techDataSchema.projects[0])
		]);
	};

	const handleVideoChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			setNewVideoFile(file);
			setVideoFile(URL.createObjectURL(file));
			setUploadProgress(0);

			try {
				const url = await uploadFileAndGetUrl(file, setUploadProgress);
				setNewVideoFile({ file, url });
			} catch (error) {
				toast.error('Failed to upload video.');
				setUploadProgress(0);
			}
		}
	}

	const openVideoFilePicker = () => {
		const filePickerElement = document.getElementById('VideoPicker');

		filePickerElement.dispatchEvent(new MouseEvent('click'));
	}

	const uploadFileAndGetUrl = async (file, onProgress) => {
		if (!file) return null;
		const storageRef = ref(store, `files/${uuidv4() + file.name}`);
		return new Promise((resolve, reject) => {
			const uploadTask = uploadBytesResumable(storageRef, file);
			uploadTask.on(
				'state_changed',
				(snapshot) => {
					if (onProgress) {
						const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
						onProgress(progress);
					}
				},
				(error) => reject(error),
				async () => {
					const url = await getDownloadURL(uploadTask.snapshot.ref);
					resolve(url);
				}
			);
		});
	};

	const deleteVideo = async (videoUrl) => {
		try {
			if (!videoUrl) return;
			const match = decodeURIComponent(videoUrl).match(/\/o\/(.+)\?/);
			const filePath = match ? match[1] : null;
			if (!filePath) throw new Error('Invalid video URL');
			const storageRef = ref(store, filePath);
			await deleteObject(storageRef);
			setStatus('success');
			setVideoFile(null);
			setNewVideoFile(null);
			if (userProfile) {
				userProfile.video = null;
			}
		} catch (error) {
			toast.error('Failed to delete video. Please try again.');
			console.error('Error deleting video:', error);
			setStatus('error');
		}
	};

	const removeOldFile = async (fileUrl, newFileUrl) => {
		if (fileUrl && newFileUrl && (fileUrl !== newFileUrl)) {
			const match = decodeURIComponent(fileUrl).match(/\/o\/(.+)\?/);
			const filePath = match ? match[1] : null;
			if (!filePath) return;
			const storageRef = ref(store, filePath);

			try {
				await deleteObject(storageRef);
			} catch (error) {
				if (error.code !== 'storage/object-not-found') {
					console.error('Error deleting old file:', error);
					throw error;
				}
			}
		}
	};


	const form = useRef();

	const onSubmit = async (event) => {
		event.preventDefault();

		try {
			// Upload new files

			const newImageUrl = await uploadFileAndGetUrl(newImageFile);

			let videoFileUrl = null;
			if (newVideoFile && newVideoFile.url) {
				videoFileUrl = newVideoFile.url;
			}

			// Upload new data

			const formElements = event.target.elements;
			const newUserProfile = structuredClone(initialFormData);

			newUserProfile.firstName = formElements.firstName.value;
			newUserProfile.lastName = formElements.lastName.value;
			newUserProfile.email =  formElements.email.value;
			newUserProfile.qualification = formElements.qualification.value;
			newUserProfile.summary = formElements.summary.value;
			newUserProfile.location = formElements.location.value;

			if (newImageUrl) newUserProfile.profileImg = newImageUrl;
			if (videoFileUrl) newUserProfile.video = videoFileUrl;

			newUserProfile.otherInfo.githubUrl = formElements.githubUrl.value;
			newUserProfile.otherInfo.linkedinUrl = formElements.linkedinUrl.value;
			newUserProfile.availability = formElements.availability.value;
			newUserProfile.workSite = formElements.workSite.value;
			newUserProfile.skills = skills;
			newUserProfile.projects = projects;

			await updateUserProfile(newUserProfile);
			console.log(newUserProfile);	

			// Delete old image (if any)

			const imageUrl = userProfile?.profileImg;
			const videoUrl = userProfile?.video;
			await removeOldFile(imageUrl, newImageUrl);
			await removeOldFile(videoUrl, videoFileUrl);

			navigate('/myProfile');
		} catch(error) {
			console.error(error);
			toast.error('Profile failed to be completely updated.');
		}
	};

	return (
		<>
			{userProfile && (
				<div id='UpdateProfile'>
					<form id='UserProfile' ref={form} onSubmit={onSubmit}>
						<section className={styles.PersonalInfo}>
							<div>
								<Upload setNewImageFile={setNewImageFile} />
							</div>

							<InputSection field={ { type:  'text', name:  'firstName', label:  'First Name' } } value={initialFormData?.firstName} />
							<InputSection field={ { type:  'text', name:  'lastName',  label:  'Last Name' } } value={initialFormData?.lastName} />
							<InputSection field={ { type:  'text', name:  'location',  label:  'Location' } } value={initialFormData?.location} />
							<InputSection field={ { type:  'email', name:  'email',  label:  'Email' } } value={initialFormData?.email} />
							<InputSection field={ { type:  'url', name:  'githubUrl',  label:  'GitHub' } } value={initialFormData?.otherInfo?.githubUrl} />
							<InputSection field={ { type:  'url', name:  'linkedinUrl',  label:  'LinkedIn' } } value={initialFormData?.otherInfo?.linkedinUrl} />
							<InputSection field={ { type:  'text', name:  'qualification',  label:  'Qualification' } } value={initialFormData?.qualification} />
							<InputSection field={ { type:  'select', name:  'availability',  label:  'Availability', options: ['Full Time', 'Part Time', 'Other'] } } value={initialFormData?.qualification} />

							<label>
								<span>Work location</span>
								<label><input type='radio' name='workSite' value='On Site' defaultChecked={initialFormData?.workSite === 'On Site'}/> On Site</label>
								<label><input type='radio' name='workSite' value='Hybrid' defaultChecked={initialFormData?.workSite === 'Hybrid'}/> Hybrid</label>
								<label><input type='radio' name='workSite' value='Remote' defaultChecked={initialFormData?.workSite === 'Remote'}/> Remote</label>
							</label>

							<InputSection field={ { type:  'textArea', name:  'summary',  label:  'About' } } value={initialFormData?.summary} />
						</section>

						<section className={styles.Video}>
							<h3>Video</h3>
							<div className={styles.VideoContainer}>
								<div>
									<input id='VideoPicker' type='file' onChange={handleVideoChange} />
									<video 
										src={videoFile ? videoFile : userProfile?.video}
										controls
										autoPlay
									/>
									<div className={styles.VideoButtons}>
										<button type='button' onClick={openVideoFilePicker}>Add Video</button>
										<button type='button' onClick={() => deleteVideo(userProfile.video)}>Delete Video</button>
										{status === 'success' && <span className={styles.success}>Click Save to see the update.</span>}
									</div>
								</div>
								{uploadProgress > 0 && uploadProgress < 100 && (
									<div className={styles.ProgressBarWrapper}>
										<div className={styles.ProgressBar} style={{ width: `${uploadProgress}%` }} />
										<span>{uploadProgress}%</span>
									</div>
								)}
							</div>
						</section>

						<section className={styles.Projects}>
							<button type='button' onClick={addProject}>Add Project</button>
							<h3>Projects</h3>
							<ResponsiveGrid minColumnWidth='250px' rowGap='20px' columnGap='20px'>
								{projects.map((project, index) => (
									<div className='Cell' key={project.title ? project.title : index}>
										<InputSection
											value={project.title}
											field={{
												name: 'title',
												label: `Project ${index + 1} Title`,
												type: 'text',
												placeholder: 'Title',
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, title: value } : p
													)
												);
											}}
										/>
										<InputSection
											value={project.url}
											field={{
												name: 'url',
												label: 'URL',
												type: 'text',
												placeholder: 'URL',
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, url: value } : p
													)
												);
											}}
										/>
										<InputSection
											value={project.description}
											field={{
												name: 'description',
												label: 'Description',
												type: 'textArea',
												placeholder: 'Description',
											}}
											onChange={(e) => {
												const value = e.target.value;
												setProjects((prevProjects) =>
													prevProjects.map((p, i) =>
														i === index ? { ...p, description: value } : p
													)
												);
											}}
											onDelete={() => deleteProject(index)}
										/>
									</div>
								))}
							</ResponsiveGrid>
						</section>

						<section className={styles.Skills}>
							<h3>Skills</h3>
							<button type="button" onClick={addSkill}>+</button>
							{skills.map((skill, index) => (
								<Badge key={skill.skill} onClose={() => deleteSkill(index)}>{skill.skill}</Badge>
							))}
			     			</section>
						<button type='submit'>
							<span>Save</span>
						</button>
					</form>
					<ChangePassword />
					<DeleteAccount />
				</div>
			)}
		</>
	);
}
