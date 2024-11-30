import { logEvent, Analytics } from 'firebase/analytics';
import { analytics } from './firebaseApp';

class FirebaseLogger {
    static logEvent(eventName: string, params: Record<string, any> = {}) {
        if (analytics) {
            logEvent(analytics as Analytics, eventName, params); // Type assertion ensures `analytics` is treated as Analytics
        } else {
            console.warn('Firebase Analytics not initialized. Event not logged:', eventName);
        }
    }

    static logAdminAction(action: string, details: Record<string, any> = {}) {
        this.logEvent('admin_action', { action, ...details });
    }

    static logError(error: Error, additionalInfo: Record<string, any> = {}) {
        this.logEvent('error', {
            message: error.message,
            stack: error.stack,
            ...additionalInfo,
        });
    }
}

export default FirebaseLogger;
