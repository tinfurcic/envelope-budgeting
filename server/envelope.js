import { db } from "../firebase-admin.js";

export const getAllEnvelopes = async () => {
  try {
    const envelopesRef = db.collection("envelopes"); // Top-level "envelopes" collection
    const querySnapshot = await envelopesRef.get();
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all envelopes (Admin SDK):", error);
    throw new Error("Failed to fetch envelopes.");
  }
};

export const getEnvelopeById = async (envelopeId) => {
  try {
    const envelopeRef = db.collection("envelopes").doc(String(envelopeId));
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


export const createEnvelope = async (name, budget, currentAmount) => {
  try {
    const settingsRef = db.collection("settings").doc("nextId");
    const envelopesRef = db.collection("envelopes");

    let nextId;

    // Use a transaction to ensure atomicity
    await db.runTransaction(async (transaction) => {
      const settingsDoc = await transaction.get(settingsRef);

      if (!settingsDoc.exists) {
        throw new Error("Settings document not found!");
      }

      nextId = settingsDoc.data().nextId;

      // Increment nextId
      transaction.update(settingsRef, { nextId: nextId + 1 });

      // Create a new envelope with the current nextId
      const newEnvelope = {
        id: nextId,
        name,
        budget: parseFloat(budget),
        currentAmount: parseFloat(currentAmount),
      };
      const newDocRef = envelopesRef.doc(String(nextId));
      transaction.set(newDocRef, newEnvelope);
    });

    return { id: nextId, name, budget: parseFloat(budget), currentAmount: parseFloat(currentAmount) };
  } catch (error) {
    console.error("Error creating envelope:", error);
    throw new Error("Failed to create the envelope.");
  }
};

// return the complete updated envelope, or just the stuff that changed?
export const updateEnvelope = async (envelopeId, newName, newBudget, newCurrentAmount) => {
  try {
    const updates = {};
    if (newName) updates.name = newName;
    if (newBudget !== undefined) updates.budget = parseFloat(newBudget);
    if (newCurrentAmount !== undefined) updates.currentAmount = parseFloat(newCurrentAmount);

    const envelopeRef = db.collection("envelopes").doc(envelopeId);
    await envelopeRef.update(updates);

    return { id: envelopeId, ...updates };
  } catch (error) {
    console.error("Error updating envelope (Admin SDK):", error);
    throw new Error("Failed to update the envelope.");
  }
};

export const deleteEnvelope = async (envelopeId) => {
  try {
    const envelopeRef = db.collection("envelopes").doc(envelopeId);
    await envelopeRef.delete();
  } catch (error) {
    console.error("Error deleting envelope (Admin SDK):", error);
    throw new Error("Failed to delete the envelope.");
  }
};
