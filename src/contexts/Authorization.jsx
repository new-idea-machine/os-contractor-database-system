import React, { useContext, useState, useEffect } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
	getAdditionalUserInfo,
	sendSignInLinkToEmail,
	fetchSignInMethodsForEmail,
	deleteUser,
	signInWithCredential

} from 'firebase/auth';
import { auth, db} from '../firebaseconfig';
import {
	doc,
	addDoc,
	getDoc,
	//   onSnapshot,
	setDoc,
	collection,
	//   query,
	//   getDocs,
	//   where,
	//   orderBy,
} from 'firebase/firestore';

export const authContext = React.createContext();

export default function AuthControl(props) {
	const children = props.children;
	const [credential, setCredential] = useState(null);
	const [user, setUser] = useState(undefined);

	const onAuthStateChangedCallback = (newUser) => {
		if (newUser) {
			setUser(newUser);
		} else {
			// setCredential(null);
			setUser(null);
		}
	  };
	// This is the firebase method that checks
	// The current user in our application from our
	// Project's authentication
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, onAuthStateChangedCallback);
		return () => unsubscribe();
	  }, []);

	const isAuthenticated = () => {
		return !!user;
	  };

	// This Function is declared to be called in the below
	// function --createUserInDatabase-- To add the creted
	// id of the "tech" object, to the object itself
	const addDocumentIdFieldToObject = async (id, userType) => {
		const userDocRef = doc(db, userType, id);
		const docSnapshot = await getDoc(userDocRef);

		if (!docSnapshot.exists()) {
		  await setDoc(userDocRef, { id });
		}
	};

	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
		 	const userCredential = await signInWithPopup(auth, provider);
			const { isNewUser } = getAdditionalUserInfo(userCredential)
			const currentUser = userCredential.user;
			const { displayName, email} = currentUser;

			if(isNewUser){
				setCredential({
					providerId: "Google",
					email,
					providerCredential: GoogleAuthProvider.credentialFromResult(userCredential),
					displayName,
			 	});
				await deleteUser(currentUser);
			}
		  } catch (error) {
			console.log(error.message);
		}
	};

	const loginWithTwitter = async () => {
		try {
			const provider = new TwitterAuthProvider();
			const userCredential = await signInWithPopup(auth, provider);
			const { isNewUser } = getAdditionalUserInfo(userCredential);
			const currentUser = userCredential.user;
			const displayName = currentUser.displayName;
			const screenName = currentUser.reloadUserInfo.screenName;

			if(isNewUser){
				setCredential({
					providerId: "X",
					email: screenName,
					providerCredential: TwitterAuthProvider.credentialFromResult(userCredential),
					displayName,
			 	});
				await deleteUser(currentUser);
			}
		  } catch (error) {
			console.log(error.message);
		}
	};

	// This function is declared to be called in the below
	// Register function to create out "tech" object with our
	// defined schema relateing it to the "user" by firebase
	// with the "firebaseUID"
	const createUserInDatabase = async (
		displayName,
		registerEmail,
		firebaseUID,
		userType
	) => {
		//console.log(userType, 'userType');
		const data = {
			name: displayName,
			email: registerEmail,
			firebaseUID: firebaseUID,
			userType: userType,
		};
		const createUserRequest = await addDoc(collection(db, userType), data);
		// console.log('Document written with ID: ', createUserRequest.id);
		const idToAdd = createUserRequest.id;
		addDocumentIdFieldToObject(idToAdd, userType);
	};

	// This function registers the user with firebase
	const register = async (
		displayName,
		registerPassword,
		userType
	) => {
		try {
			let userCredential = null;

			if (credential?.providerCredential) {
				console.assert(credential?.providerId);
				userCredential = await signInWithCredential(auth, credential.providerCredential);
			} else {
				const signInMethods = await fetchSignInMethodsForEmail(auth, credential.email);

				if (signInMethods.length > 0) {
					return false;
				}
				userCredential = await createUserWithEmailAndPassword(
					auth,
					credential.email,
					registerPassword
				);

				// Send the sign-in link to the user's email
				const actionCodeSettings = {
					//url: 'https://open-source-techbook-81fb2.web.app/auth',
					url: 'http://localhost:3000/auth',
					handleCodeInApp: true,
				};
				sendSignInLinkToEmail(auth, credential.email, actionCodeSettings).then(()=>{
					localStorage.setItem('email', credential.email);}).catch(error=>{
						console.log(error.message);
					})
			}

			const currentUser = userCredential.user;

			await updateProfile(currentUser, { displayName: displayName })
				.then(() => {
					// ...

					const FUID = currentUser.uid;
					//console.log(FUID);
					createUserInDatabase(displayName, credential.email, FUID, userType);
				})
				.catch((error) => {
					console.log(error.message);
					return false;
				});

				setCredential(null);
				return true;
		} catch (error) {
			console.log(error.message);
			return false;
		}
	};

	// This function Logs the user in
	const login = async (loginEmail, loginPassword) => {
		try {
			// Check if the email address exists
			const signInMethods = await fetchSignInMethodsForEmail(auth, loginEmail);
			if (signInMethods.length === 0) {
				return 'auth/user-not-found';
			}

			await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
			return 'signed-in';
		} catch (error) {
			console.log(error?.message);
			return error?.code;
		}
	};

	// This function logs the user out
	const logout = async () => {
		await signOut(auth);
	};

	const authFunctions = {
		credential,
		setCredential,
		user,
		register,
		login,
		logout,
		isAuthenticated,
		loginWithGoogle,
		loginWithTwitter,
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
