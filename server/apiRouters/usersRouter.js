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
      totalBudget: 0,
      nextEnvelopeId: 1,
      nextExpenseId: 1,
      nextGoalId: 1,
    });

    // Adding a metadata doc because collections without documents can't exist on firebase
    const envelopesRef = userRef.collection("envelopes");
    await envelopesRef.doc("metadata").set({
      initialized: true,
    });

    const expensesRef = userRef.collection("expenses");
    await expensesRef.doc("metadata").set({
      initialized: true,
    });

    const goalsRef = userRef.collection("goals");
    await goalsRef.doc("metadata").set({
      initialized: true,
    });

    // Initialize income with default values
    const incomeRef = userRef.collection("income");
    await Promise.all([
      incomeRef.doc("regularIncome").set({ value: 0 }),
      incomeRef.doc("extraIncome").set({ value: 0 }),
    ]);

    // Initialize savings with default values
    const savingsRef = userRef.collection("savings");
    await Promise.all([
      savingsRef.doc("shortTermSavings").set({ value: 0 }),
      savingsRef.doc("longTermSavings").set({ value: 0 }),
    ]);

    // Initialize settings with default values
    const settingsRef = userRef.collection("settings");
    await Promise.all([
      settingsRef.doc("currencyType").set({ value: "USD" }),
      settingsRef.doc("enableDebt").set({ value: false }),
    ]);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user document:", error.message);
    res.status(500).json({ error: "Failed to create user document" });
  }
});
