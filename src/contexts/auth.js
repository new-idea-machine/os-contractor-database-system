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
	addDoc,
	//   getDoc,
	//   onSnapshot,
	setDoc,
	serverTimestamp,
	updateDoc,
	collection,
	//   query,
	//   getDocs,
	//   where,
	//   orderBy,
} from 'firebase/firestore';
// import { Toast } from 'react-toastify/dist/components';

export const authContext = React.createContext();

export default function AuthControl(props) {
	const children = props.children;
	const [user, setUser] = useState({});

	// This is the firebase method that checks
	// The current user in our application from our
	// Project's authentication
	onAuthStateChanged(auth, (currentUser) => {
		setUser(currentUser);
		// console.log('>><<<', user);
	});

	// This Function is declared to be called in the below
	// function --createUserInDatabase-- To add the creted
	// id of the "tech" object, to the object itself
	const addDocumentIdFieldToObject = async (id) => {
		const data = {
			id: id,
		};
		const userDocRef = doc(db, 'techs', id);
		if (userDocRef) {
			await updateDoc(userDocRef, data);
			console.log('User successfully updated!');
		} else {
			console.log('object not found');
		}
	};

	// This function is declared to be called in the below
	// Register function to create out "tech" object with our
	// defined schema relateing it to the "user" by firebase
	// with the "firebaseUID"
	const createUserInDatabase = async (
		registerEmail,
		displayName,
		firebaseUID
	) => {
		const data = {
			name: displayName,
			email: registerEmail,
			firebaseUID: firebaseUID,
		};
		const createUserRequest = await addDoc(collection(db, 'techs'), data);
		// console.log('Document written with ID: ', createUserRequest.id);
		const idToAdd = createUserRequest.id;
		addDocumentIdFieldToObject(idToAdd);
	};

	// This function registers the user with firebase
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
					// ...
					const FUID = auth.currentUser.uid;
					createUserInDatabase(registerEmail, displayName, FUID);
				})
				.catch((error) => {
					console.log(error.message);
				});
		} catch (error) {
			console.log(error.message);
		}
	};

	// This function Logs the user in
	const login = async (loginEmail, loginPassword) => {
		try {
			await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
		} catch (error) {
			console.log(error.message);
		}
	};

	// This function logs the user out
	const logout = async () => {
		await signOut(auth);
	};

	// Currently not in use passwordless sign In
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
