import { db } from "../firebase-admin.js";
import admin from "firebase-admin";

// Get all envelopes for a specific user
export const getAllEnvelopes = async (userId) => {
  try {
    const envelopesRef = db
      .collection("users")
      .doc(userId)
      .collection("envelopes")
      .orderBy("id", "asc");

    const querySnapshot = await envelopesRef.get();
    let metadata = null;

    const envelopes = querySnapshot.docs
      .map((doc) => {
        if (doc.id === "metadata") {
          metadata = { id: doc.id, ...doc.data() };
          return null;
        }
        return { id: doc.id, ...doc.data() };
      })
      .filter(Boolean); // Remove null values (metadata)

    return { envelopes, metadata };
  } catch (error) {
    console.error("Error fetching all envelopes:", error);
    throw new Error("Failed to fetch envelopes.");
  }
};

// Get a specific envelope by ID for a user
export const getEnvelopeById = async (userId, envelopeId) => {
  try {
    const envelopeRef = db
      .collection("users")
      .doc(userId)
      .collection("envelopes")
      .doc(envelopeId);
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

export const createEnvelope = async (
  userId,
  name,
  budget,
  currentAmount,
  description,
  color,
) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const envelopeMetadataRef = userRef.collection("envelopes").doc("metadata");
    const envelopeMetadataDoc = await envelopeMetadataRef.get();

    if (!envelopeMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }

    const { nextEnvelopeId = 1, count } = envelopeMetadataDoc.data();

    const envelopeRef = userRef
      .collection("envelopes")
      .doc(String(nextEnvelopeId));

    const newEnvelope = {
      id: nextEnvelopeId,
      name,
      budget: parseFloat(budget),
      currentAmount: parseFloat(currentAmount),
      description,
      color,
      order: count + 1,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const batch = db.batch();
    batch.set(envelopeRef, newEnvelope);
    batch.update(envelopeMetadataRef, {
      nextEnvelopeId: nextEnvelopeId + 1,
      count: count + 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return newEnvelope;
  } catch (error) {
    console.error("Error creating envelope:", error);
    throw new Error("Failed to create the envelope.");
  }
};

// Update an envelope for a user
export const updateEnvelope = async (
  userId,
  envelopeId,
  newName,
  newBudget,
  newCurrentAmount,
  newDescription,
  newColor,
  newOrder,
) => {
  try {
    const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (newName) updates.name = newName;
    if (newBudget !== undefined) updates.budget = parseFloat(newBudget);
    if (newCurrentAmount !== undefined)
      updates.currentAmount = parseFloat(newCurrentAmount);
    if (newDescription !== undefined) updates.description = newDescription;
    if (newColor !== undefined) updates.color = newColor;
    if (newOrder !== undefined) updates.order = newOrder;

    const envelopeRef = db
      .collection("users")
      .doc(userId)
      .collection("envelopes")
      .doc(envelopeId);
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
    const userRef = db.collection("users").doc(userId);
    const envelopeMetadataRef = userRef.collection("envelopes").doc("metadata");
    const envelopeMetadataDoc = await envelopeMetadataRef.get();

    if (!envelopeMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }

    const { count } = envelopeMetadataDoc.data();

    const envelopeRef = db
      .collection("users")
      .doc(userId)
      .collection("envelopes")
      .doc(envelopeId);

    const batch = db.batch();
    batch.delete(envelopeRef);
    batch.update(envelopeMetadataRef, {
      count: count - 1,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await batch.commit();
  } catch (error) {
    console.error("Error deleting envelope (Admin SDK):", error);
    throw new Error("Failed to delete the envelope.");
  }
};
