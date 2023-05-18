import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
apiKey: "AIzaSyB903v3fgxhCTd51ugDTDcxfrp9CIsBvFU",
	authDomain:  "open-source-techbook.firebaseapp.com",
	projectId: "open-source-techbook",
	storageBucket:  "open-source-techbook.appspot.com",
	messagingSenderId: "612368218916",
	appId: "1:612368218916:web:4bcdce6651541eef23d1b1",
};

const app = initializeApp(firebaseConfig);
const store = getStorage(app);
const db = getFirestore(app);
// const fbFunctions = getFunctions(app);
const auth = getAuth(app);

export { store, auth, db };