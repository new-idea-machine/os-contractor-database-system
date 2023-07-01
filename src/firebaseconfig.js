import React from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
	apiKey: "AIzaSyB3UNaATVGNIrsWRjvtMlQbHWoXCqNMRcA",
	authDomain:  "open-source-techbook-81fb2.firebaseapp.com",
	projectId: "open-source-techbook-81fb2",
	storageBucket:  "open-source-techbook-81fb2.appspot.com",
	messagingSenderId: "431842611746",
	appId: "1:431842611746:web:b259f2e6da08748339307b",
	measurementId: "G-8CNW6J7E8M"
};

const app = initializeApp(firebaseConfig);
const store = getStorage(app);
const db = getFirestore(app);
const fbFunctions = getFunctions(app);
const auth = getAuth(app);

export { store, auth, db, fbFunctions };