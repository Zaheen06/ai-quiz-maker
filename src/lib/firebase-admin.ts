import admin from "firebase-admin";

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.FIREBASE_PROJECT_ID;

if (!privateKey || !clientEmail || !projectId) {
    console.error("Missing Firebase Admin credentials. Please check .env file.");
    // Do not throw here to allow build to pass, but runtime will fail if auth is used.
} else if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
    });
}

export const firebaseAdmin = admin;
