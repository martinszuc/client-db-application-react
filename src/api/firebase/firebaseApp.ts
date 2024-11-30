import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase app (singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics (conditionally)
let analytics: Analytics | null = null;
if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
}

export { app, analytics };
