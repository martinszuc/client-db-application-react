import { getApp, getApps, initializeApp } from 'firebase/app';
import { Analytics, getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from '@firebaseDir/firebaseConfig';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics with proper typing
let analytics: Analytics | null = null;
if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
}

export { app, analytics };
