/*
import admin from "firebase-admin";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs";

// Load environment variables from the .env file
dotenv.config();

// Get the current directory name for resolving the path
const __dirname = dirname(fileURLToPath(import.meta.url));

// Resolve the path to the service account JSON file
const serviceAccountPath = resolve(
  __dirname,
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
);

// Read and parse the service account JSON file manually
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Access Firestore
const db = admin.firestore();
export { db };
*/

import admin from "firebase-admin";
import dotenv from "dotenv";
import { resolve } from "path";
import fs from "fs";

// Load environment variables from the .env file
dotenv.config();

// Get the path to the service account JSON file from the environment variable
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// Ensure the file exists before attempting to read it
if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  throw new Error("Firebase service account key file is missing or invalid.");
}

// Read and parse the service account JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(resolve(serviceAccountPath), "utf-8"),
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Access Firestore
const db = admin.firestore();
export { db };
