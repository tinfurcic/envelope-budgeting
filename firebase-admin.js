import admin from "firebase-admin";
import serviceAccount from "./firebase-adminsdk.json" assert { type: "json" };

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
