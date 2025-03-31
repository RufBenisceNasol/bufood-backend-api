const admin = require("firebase-admin");

// Load Firebase service account key
const serviceAccount = require("./privateKey.json"); // Make sure this path is correct

// Initialize Firebase Admin SDK (only initialize once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth(); // ✅ Export Firebase Authentication
const db = admin.firestore(); // ✅ Export Firestore database

module.exports = { auth, db };
