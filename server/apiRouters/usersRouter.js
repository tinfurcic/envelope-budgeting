import express from "express";
import { db } from "../../firebase-admin.js";
import admin from "firebase-admin";

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
      nextEnvelopeId: 1,
      count: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(userRef.collection("expenses").doc("metadata"), {
      nextExpenseId: 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(userRef.collection("goals").doc("metadata"), {
      nextGoalId: 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Initialize income collection
    batch.set(userRef.collection("income").doc("regularIncome"), {
      value: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(userRef.collection("income").doc("extraIncome"), {
      value: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Initialize savings collection
    batch.set(userRef.collection("savings").doc("shortTermSavings"), {
      id: -1,
      currentAmount: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(userRef.collection("savings").doc("longTermSavings"), {
      id: -2,
      currentAmount: 0,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Initialize expensesHistory collection
    batch.set(userRef.collection("expensesHistory").doc("metadata"), {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Initialize settings collection
    batch.set(userRef.collection("settings").doc("currencyType"), {
      value: "USD",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(userRef.collection("settings").doc("enableDebt"), {
      value: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Commit the batch
    await batch.commit();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user document:", error.message);
    res.status(500).json({ error: "Failed to create user document" });
  }
});
