// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebase = {
    apiKey: "AIzaSyDJi2ynPLEEaT6PhtIujLY36kHuD83c8kQ",
    authDomain: "studiolenkaszuc.firebaseapp.com",
    projectId: "studiolenkaszuc",
    storageBucket: "studiolenkaszuc.firebasestorage.app",
    messagingSenderId: "777454879134",
    appId: "1:777454879134:web:882d145b1e445f37dd968f",
    measurementId: "G-J5FHTK211G"
};

const app = initializeApp(firebase);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export { auth };