// src/utils/logger.ts

import { logEvent } from 'firebase/analytics';
import { Analytics } from 'firebase/analytics';
import { analytics } from '../api/firebase/firebaseApp';

class Logger {
    private isEnabled: boolean;
    private isAdmin: boolean;

    constructor() {
        this.isEnabled = true; // Enable/disable all logging
        this.isAdmin = false;  // Update this based on user role
    }

    // Method to set admin status (used in Auth flow)
    setAdminStatus(isAdmin: boolean) {
        this.isAdmin = isAdmin;
    }

    // Log to both console and Firebase (if initialized)
    private logToFirebase(eventName: string, params: Record<string, any> = {}) {
        if (analytics) {
            logEvent(analytics as Analytics, eventName, params);
        } else {
            console.warn(`[FIREBASE WARN] Firebase Analytics not initialized for event: ${eventName}`);
        }
    }

    info(message: string, ...optionalParams: any[]) {
        if (this.isEnabled && this.isAdmin) {
            console.info(`[INFO] ${new Date().toISOString()}: ${message}`, ...optionalParams);
            this.logToFirebase('info', { message, optionalParams });
        }
    }

    warn(message: string, ...optionalParams: any[]) {
        if (this.isEnabled && this.isAdmin) {
            console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...optionalParams);
            this.logToFirebase('warn', { message, optionalParams });
        }
    }

    error(message: string, ...optionalParams: any[]) {
        if (this.isEnabled && this.isAdmin) {
            console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...optionalParams);
            this.logToFirebase('error', { message, optionalParams });
        }
    }

    debug(message: string, ...optionalParams: any[]) {
        if (this.isEnabled && this.isAdmin) {
            console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...optionalParams);
            this.logToFirebase('debug', { message, optionalParams });
        }
    }

    // Custom method for admin-specific actions
    logAdminAction(action: string, details: Record<string, any> = {}) {
        if (this.isEnabled && this.isAdmin) {
            console.info(`[ADMIN ACTION] ${new Date().toISOString()}: ${action}`, details);
            this.logToFirebase('admin_action', { action, ...details });
        }
    }
}

const logger = new Logger();
export default logger;
