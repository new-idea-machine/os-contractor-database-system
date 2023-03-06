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

const updateProfileFields = async (id, linkedInURL, githubUrl) => {
	const data = {
		otherInfo: {
			linkedInUrl: linkedInURL,
			githubUrl: githubUrl,
		},
	};
	const userDocRef = doc(db, 'techs', id);
	if (userDocRef) {
		await updateDoc(userDocRef, data);
		console.log('User successfully updated!');
	} else {
		console.log('object not found');
	}
};

export {};
