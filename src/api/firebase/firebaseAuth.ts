// src/services/firebase/firebaseAuth.ts
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {app} from './firebaseApp';

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export authentication functions
export const signInWithGoogle = () => signInWithPopup(auth, provider);
export const logout = () => signOut(auth);
export { auth, provider };
