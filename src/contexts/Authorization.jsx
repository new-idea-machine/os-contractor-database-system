import React, { useContext, useState, useEffect } from 'react';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut,
	updateProfile,
	signInWithEmailLink,
	GoogleAuthProvider,
	TwitterAuthProvider,
	signInWithPopup,
	getAdditionalUserInfo,
	sendSignInLinkToEmail,
	isSignInWithEmailLink,
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
// import { Toast } from 'react-toastify/dist/components';

export const authContext = React.createContext();

export default function AuthControl(props) {
	const children = props.children;
	const [credential, setCredential] = useState(null);
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);

	const onAuthStateChangedCallback = (newUser) => {
		if (newUser) {
			setUser(newUser);
		} else {
			// setCredential(null);
			setUser(null);
			// setUserProfile(null);
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

		if (docSnapshot.exists()) {
		  console.log('Document already exists');
		} else {
		  const data = {
			id: id,
		  };
		  await setDoc(userDocRef, data);
		  console.log('Document created with ID:', id);
		}
	};

	const loginWithGoogle = async () => {
		try {
			const provider = new GoogleAuthProvider();
		 	const userCredential = await signInWithPopup(auth, provider);
			console.log(userCredential);
			const { isNewUser } = getAdditionalUserInfo(userCredential)
			const currentUser = userCredential.user;
			const { displayName, email} = currentUser;

			console.log(`Is ${isNewUser ? "" : "not "}a new user`);


			if(isNewUser){
				setCredential({
					providerId: "Google",
					email,
					providerCredential: GoogleAuthProvider.credentialFromResult(userCredential),
					displayName,
			 	});
				await deleteUser(currentUser);
				// setUser(null);
			}


			console.log('Logged in with Google');
		  } catch (error) {
			console.log(error.message);
		}
	};

	const loginWithTwitter = async () => {
		try {
			const provider = new TwitterAuthProvider();
			const userCredential = await signInWithPopup(auth, provider);
			const { isNewUser } = getAdditionalUserInfo(userCredential);
			console.log(isNewUser);
			const currentUser = userCredential.user;
			console.log(currentUser);
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
				// setUser(null);
			}

			console.log('Logged in with twitter');
		  } catch (error) {
			console.log(error.message);
		}
	};


	const promptUserType = async() => {
		// Prompt the user to choose a user type

		const userTypeInput = prompt('Please choose a user type: 1 for Contractor, 2 for Recruiter');

		// Validate and return the selected user type
		if (userTypeInput === '1') {
			return 'techs';
		} else if (userTypeInput === '2') {
			return 'recruiter';
		} else {
			// Invalid user type selected, prompt again or handle accordingly
			return promptUserType();
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
		console.log("User clicked on \"Register\" button");

		try {
			let userCredential = null;

			if (credential?.providerCredential) {
				console.assert(credential?.providerId);
				console.log(`Signing in with ${credential?.providerId}...`);
				console.log(credential);
				userCredential = await signInWithCredential(auth, credential.providerCredential);
				console.log("Got userCredential...");
				const { isNewUser } = getAdditionalUserInfo(userCredential)

				console.log(isNewUser);
				console.log(`Registered with ${credential?.providerId}`);
			} else {
				const signInMethods = await fetchSignInMethodsForEmail(auth, credential.email);

				if (signInMethods.length > 0) {
					console.log('Email address is already registered');
					return false;
				}
				userCredential = await createUserWithEmailAndPassword(
					auth,
					credential.email,
					registerPassword
				);
				console.log('user created');

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
				console.log('Email address does not exist');
				return 'auth/user-not-found';
			}

			await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
			return 'signed-in';
		} catch (error) {
			console.log(error?.message);
			// if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code ==='auth/invalid-email') {
			// 	throw new Error('Invalid login credentials');
			// }
			return error?.code;
		}
	};

	// This function logs the user out
	const logout = async () => {
		await signOut(auth);
	};

	// Currently not in use passwordless sign In
	const signInWithEmail = async () => {
		const email = window.localStorage.getItem('email');
		if (isSignInWithEmailLink(auth, window.location.href)) {
			try {

				const result = await signInWithEmailLink(auth, email, window.location.href);
				// Clear email from storage.
				//window.localStorage.removeItem('emailForSignIn');
				// console.log("got here signinwith");
				// Clear email from storage.
				window.localStorage.setItem('email', email);
				//window.localStorage.removeItem('emailForSignIn');
				// You can access the new user via result.user
				// Additional user info profile not available via:
				// result.additionalUserInfo.profile == null
				// You can check if the user is new or existing:
				console.log('Email link sign-in successful:', result.user);
			} catch (error) {
			  console.log('Email link sign-in error:', error.message);
			}
		  }
		};

	const authFunctions = {
		credential,
		setCredential,
		user,
		userProfile,
		register,
		login,
		logout,
		isAuthenticated,
		loginWithGoogle,
		loginWithTwitter,
		signInWithEmail,
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
