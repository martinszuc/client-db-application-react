const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: process.env.FIREBASE_AUTH_URI,
        tokenUri: process.env.FIREBASE_TOKEN_URI,
        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    }),
});

// Convert the environment variable to an array
const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || '').split(',');

async function setAdminClaim() {
    try {
        for (const email of adminEmails) {
            const user = await admin.auth().getUserByEmail(email.trim());
            await admin.auth().setCustomUserClaims(user.uid, { admin: true });
            console.log(`Admin claim set for ${user.email}`);
        }
    } catch (error) {
        console.error('Error setting admin claim:', error);
    }
}

setAdminClaim();

export{};