// functions/src/setAdmins.ts

import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});

const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || "").split(",");

const setAdminClaims = async () => {
    try {
        for (const email of adminEmails) {
            const user = await admin.auth().getUserByEmail(email.trim());
            await admin.auth().setCustomUserClaims(user.uid, { admin: true });
            console.log(`Admin claim set for ${user.email}`);
        }
        process.exit();
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error setting admin claim:", error.message);
        } else {
            console.error("An unknown error occurred.");
        }
        process.exit(1);
    }
};

setAdminClaims();
