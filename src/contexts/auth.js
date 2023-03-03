import React, { useContext, useState, useEffect } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
	signInWithEmailLink,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
} from 'firebase/auth';
import { store, auth, db, fbFunctions } from '../firebaseconfig';
import {
	doc,
	//   getDoc,
	//   onSnapshot,
	setDoc,
	serverTimestamp,
	//   updateDoc,
	//   collection,
	//   query,
	//   getDocs,
	//   where,
	//   orderBy,
} from 'firebase/firestore';

export const authContext = React.createContext();

export default function AuthControl(props) {
	const children = props.children;
	const [user, setUser] = useState({});

	onAuthStateChanged(auth, (currentUser) => {
		setUser(currentUser);
		console.log('>><<<', user);
	});

	const register = async (registerEmail, displayName, registerPassword) => {
		try {
			await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
			updateProfile(auth.currentUser, {
				displayName: displayName,
			})
				.then(() => {
					// const URL = `https://us-central1-xen-wellness.cloudfunctions.net/clientsCollection/api/createClient/`;
					// const data = {
					// 	userUid: auth.currentUser.uid,
					// 	email: registerEmail,
					// 	clientName: displayName,
					// };
					// axios.post(URL, data).then((res) => {
					// 	console.log('Client created', res);
					// });
					// Profile updated!
					// ...
				})
				.catch((error) => {
					// An error occurred
					// ...
				});
		} catch (error) {
			console.log(error.message);
		}
	};

	const login = async (loginEmail, loginPassword) => {
		try {
			const user = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword
			);
		} catch (error) {
			console.log(error.message);
		}
	};

	const logout = async () => {
		await signOut(auth);
	};

	const signInWithEmail = async () => {
		let email = window.localStorage.getItem('emailForSignIn');
		signInWithEmailLink(auth, email, window.location.href)
			.then((result) => {
				// console.log("got here signinwith");
				// Clear email from storage.
				window.localStorage.setItem('emailForSignIn', email);
				//window.localStorage.removeItem('emailForSignIn');
				// You can access the new user via result.user
				// Additional user info profile not available via:
				// result.additionalUserInfo.profile == null
				// You can check if the user is new or existing:
				// result.additionalUserInfo.isNewUser
			})
			.catch((error) => {
				console.log(error.message);
			});
	};

	const authFunctions = {
		user,
		register,
		login,
		logout,
		// signInWithEmail,
		// emailLogin,
	};

	return (
		<authContext.Provider value={authFunctions}>
			{children}
		</authContext.Provider>
	);
}

export const UserAuth = () => {
	return useContext(authContext);
};
