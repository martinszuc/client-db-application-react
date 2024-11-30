import { logEvent } from 'firebase/analytics';
import { analytics } from '@firebaseDir/firebaseApp';

class FirebaseLogger {
    static logEvent(eventName: string, params = {}) {
        if (analytics) {
            logEvent(analytics, eventName, params);
        } else {
            console.warn('Analytics not initialized:', eventName);
        }
    }
}

export default FirebaseLogger;
