import { db } from "../firebase-admin.js";

// Get all envelopes for a specific user
export const getAllEnvelopes = async (userId) => {
  try {
    const envelopesRef = db.collection("users").doc(userId).collection("envelopes");
    const querySnapshot = await envelopesRef.where("__name__", "!=", "metadata").get();

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all envelopes (Admin SDK):", error);
    throw new Error("Failed to fetch envelopes.");
  }
};

// Get a specific envelope by ID for a user
export const getEnvelopeById = async (userId, envelopeId) => {
  try {
    const envelopeRef = db.collection("users").doc(userId).collection("envelopes").doc(envelopeId);
    const envelopeDoc = await envelopeRef.get();

    if (!envelopeDoc.exists) {
      return null;
    }

    return { id: envelopeDoc.id, ...envelopeDoc.data() };
  } catch (error) {
    console.error("Error fetching envelope by ID (Admin SDK):", error.message);
    throw new Error("Failed to fetch the envelope.");
  }
};

// Create a new envelope for a user
export const createEnvelope = async (userId, name, budget, currentAmount) => {
  try {
    const envelopesRef = db.collection("users").doc(userId).collection("envelopes");

    // Automatically generate a new document ID
    const newDocRef = envelopesRef.doc();
    const newEnvelope = {
      name,
      budget: parseFloat(budget),
      currentAmount: parseFloat(currentAmount),
      createdAt: new Date().toISOString(),
    };
    await newDocRef.set(newEnvelope);

    return { id: newDocRef.id, ...newEnvelope };
  } catch (error) {
    console.error("Error creating envelope:", error);
    throw new Error("Failed to create the envelope.");
  }
};

// Update an envelope for a user
export const updateEnvelope = async (userId, envelopeId, newName, newBudget, newCurrentAmount) => {
  try {
    const updates = {};
    if (newName) updates.name = newName;
    if (newBudget !== undefined) updates.budget = parseFloat(newBudget);
    if (newCurrentAmount !== undefined) updates.currentAmount = parseFloat(newCurrentAmount);

    const envelopeRef = db.collection("users").doc(userId).collection("envelopes").doc(envelopeId);
    await envelopeRef.update(updates);

    return { id: envelopeId, ...updates };
  } catch (error) {
    console.error("Error updating envelope (Admin SDK):", error);
    throw new Error("Failed to update the envelope.");
  }
};

// Delete an envelope for a user
export const deleteEnvelope = async (userId, envelopeId) => {
  try {
    const envelopeRef = db.collection("users").doc(userId).collection("envelopes").doc(envelopeId);
    await envelopeRef.delete();
  } catch (error) {
    console.error("Error deleting envelope (Admin SDK):", error);
    throw new Error("Failed to delete the envelope.");
  }
};
