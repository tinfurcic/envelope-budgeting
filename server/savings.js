import { db } from "../firebase-admin.js";
import admin from "firebase-admin";

// Get all savings for a user
export const getSavings = async (userId) => {
  try {
    const savingsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("savings")
      .get();

    const savings = {};
    savingsSnapshot.forEach((doc) => {
      savings[doc.id] = doc.data().currentAmount || 0;
    });

    return savings;
  } catch (error) {
    console.error("Error fetching savings:", error.message);
    throw new Error("Failed to fetch savings.");
  }
};

export const updateSavings = async (
  userId,
  shortTermSavings,
  longTermSavings,
) => {
  try {
    const savingsRef = db.collection("users").doc(userId).collection("savings");

    // Set both savings fields in the savings collection
    await Promise.all([
      savingsRef.doc("shortTermSavings").set(
        {
          currentAmount: parseFloat(shortTermSavings),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
      savingsRef.doc("longTermSavings").set(
        {
          currentAmount: parseFloat(longTermSavings),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      ),
    ]);

    return { shortTermSavings, longTermSavings };
  } catch (error) {
    console.error("Error updating savings:", error.message);
    throw new Error("Failed to update savings.");
  }
};

// Update a specific savings type
// Isn't used on the front end
export const updateSavingsType = async (userId, savingsType, currentAmount) => {
  try {
    const savingsRef = db
      .collection("users")
      .doc(userId)
      .collection("savings")
      .doc(savingsType);
    await savingsRef.set(
      { currentAmount: parseFloat(currentAmount) },
      { merge: true },
    );

    return { [savingsType]: currentAmount };
  } catch (error) {
    console.error("Error updating savings:", error.message);
    throw new Error("Failed to update savings.");
  }
};
