// src/services/firebase/firebaseApp.ts
import {getApp, getApps, initializeApp} from 'firebase/app';
import {firebaseConfig} from './firebaseConfig';

// Initialize Firebase app (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export default app;
