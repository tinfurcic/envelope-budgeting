import express from "express";
import { db } from "../../firebase-admin.js";

export const usersRouter = express.Router();

// Create a new user document in Firestore
usersRouter.post("/", async (req, res) => {
  const { uid, email } = req.body;

  if (!uid || !email) {
    return res.status(400).json({ error: "Missing uid or email" });
  }

  try {
    const userRef = db.collection("users").doc(uid);

    // Check if the user document already exists
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return res.status(200).json({ message: "User already exists" });
    }

    // Create the user document
    await userRef.set({
      email,
      createdAt: new Date().toISOString(),
    });

    // Create a "metadata" document in the "envelopes" subcollection
    const envelopesRef = userRef.collection("envelopes");
    await envelopesRef.doc("metadata").set({
      initialized: true,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user document:", error.message);
    res.status(500).json({ error: "Failed to create user document" });
  }
});
