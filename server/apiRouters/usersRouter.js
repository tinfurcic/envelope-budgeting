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

    // Create a batch instance
    const batch = db.batch();

    // Add the user document
    batch.set(userRef, {
      email,
      createdAt: new Date().toISOString(),
    });

    // Adding a metadata docs because collections without documents can't exist on firebase
    batch.set(userRef.collection("envelopes").doc("metadata"), {
      initialized: true,
      id: -1,
      nextEnvelopeId: 1,
      count: 0,
    });
    batch.set(userRef.collection("expenses").doc("metadata"), {
      initialized: true,
      id: -1,
      nextExpenseId: 1,
    });
    batch.set(userRef.collection("goals").doc("metadata"), {
      initialized: true,
      id: -1,
      nextGoalId: 1,
    });

    // Initialize income collection
    batch.set(userRef.collection("income").doc("regularIncome"), { value: 0 });
    batch.set(userRef.collection("income").doc("extraIncome"), { value: 0 });

    // Initialize savings collection
    batch.set(userRef.collection("savings").doc("shortTermSavings"), {
      value: 0,
    });
    batch.set(userRef.collection("savings").doc("longTermSavings"), {
      value: 0,
    });

    // Initialize settings collection
    batch.set(userRef.collection("settings").doc("currencyType"), {
      value: "USD",
    });
    batch.set(userRef.collection("settings").doc("enableDebt"), {
      value: false,
    });

    // Commit the batch
    await batch.commit();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user document:", error.message);
    res.status(500).json({ error: "Failed to create user document" });
  }
});
