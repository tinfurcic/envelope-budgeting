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
    const userRef = db.collection("users").doc(userId);
    const envelopeMetadataRef = userRef.collection("envelopes").doc("metadata");
    const envelopesRef = userRef.collection("envelopes");

    const envelopeMetadataDoc = await envelopeMetadataRef.get();
    if (!envelopeMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }

    const { count } = envelopeMetadataDoc.data();

    // Fetch the envelope to get its current `order`
    const envelopeDoc = await envelopesRef.doc(envelopeId).get();
    if (!envelopeDoc.exists) {
      throw new Error("Envelope not found.");
    }

    const envelopeData = envelopeDoc.data();
    const currentOrder = envelopeData.order;

    // Validate newOrder (using count from metadata)
    if (newOrder < 1 || newOrder > count || !Number.isInteger(newOrder)) {
      throw new Error(
        `Invalid order number. It must be a positive integer between 1 and ${count}.`,
      );
    }

    // If the order hasn't changed, just update the envelope
    if (newOrder === currentOrder) {
      const updates = {
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      if (newName) updates.name = newName;
      if (newBudget !== undefined) updates.budget = parseFloat(newBudget);
      if (newCurrentAmount !== undefined)
        updates.currentAmount = parseFloat(newCurrentAmount);
      if (newDescription !== undefined) updates.description = newDescription;
      if (newColor !== undefined) updates.color = newColor;

      await envelopesRef.doc(envelopeId).update(updates);
      return { id: envelopeId, ...updates };
    }

    const batch = db.batch();

    if (newOrder < currentOrder) {
      // Move the envelope to an earlier position
      const envelopesToUpdate = await envelopesRef
        .where("order", ">=", newOrder)
        .where("order", "<", currentOrder)
        .get();

      envelopesToUpdate.forEach((doc) => {
        const docRef = doc.ref;
        batch.update(docRef, { order: doc.data().order + 1 }); // Increment the order for envelopes moving down
      });
    } else if (newOrder > currentOrder) {
      // Move the envelope to a later position
      const envelopesToUpdate = await envelopesRef
        .where("order", ">", currentOrder)
        .where("order", "<=", newOrder)
        .get();

      envelopesToUpdate.forEach((doc) => {
        const docRef = doc.ref;
        batch.update(docRef, { order: doc.data().order - 1 }); // Decrement the order for envelopes moving up
      });
    }

    // Update the target envelope's order to the new order
    const envelopeRef = envelopesRef.doc(envelopeId);
    batch.update(envelopeRef, { order: newOrder });

    // Other updates
    const updates = { updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    if (newName) updates.name = newName;
    if (newBudget !== undefined) updates.budget = parseFloat(newBudget);
    if (newCurrentAmount !== undefined)
      updates.currentAmount = parseFloat(newCurrentAmount);
    if (newDescription !== undefined) updates.description = newDescription;
    if (newColor !== undefined) updates.color = newColor;

    batch.update(envelopeRef, updates);
    await batch.commit();

    return { id: envelopeId, ...updates, order: newOrder };
  } catch (error) {
    console.error("Error updating envelope:", error);
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

    const envelopeRef = userRef.collection("envelopes").doc(envelopeId);

    // Fetch the envelope to get its `order` value
    const envelopeDoc = await envelopeRef.get();
    const envelopeData = envelopeDoc.data();

    if (!envelopeData) {
      throw new Error("Envelope not found.");
    }

    const envelopeOrder = envelopeData.order;

    // Get all envelopes with `order` greater than the deleted envelope
    const envelopesRef = userRef.collection("envelopes");
    const envelopesSnapshot = await envelopesRef
      .where("order", ">", envelopeOrder)
      .get();

    const batch = db.batch();

    // Update `order` for envelopes that need to shift
    envelopesSnapshot.docs.forEach((doc) => {
      const envelopeToUpdateRef = doc.ref;
      const updatedOrder = doc.data().order - 1; // Shift order down by 1
      batch.update(envelopeToUpdateRef, { order: updatedOrder });
    });

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
