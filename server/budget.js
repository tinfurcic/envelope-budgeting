import { db } from "../firebase-admin.js";

// Fetch the total budget for a specific user
export const getTotalBudget = async (userId) => {
  try {
    const userDoc = db.collection("users").doc(userId);
    const docSnapshot = await userDoc.get();
    if (docSnapshot.exists) {
      return docSnapshot.data().totalBudget || 0; // Default to 0 if not set
    } else {
      throw new Error("User document does not exist.");
    }
  } catch (error) {
    console.error("Error fetching total budget:", error.message);
    throw new Error("Failed to fetch total budget.");
  }
};

// Set the total budget for a specific user
export const setTotalBudget = async (userId, amount) => {
  if (typeof amount !== "number") {
    throw new Error("The budget must be a number!");
  }

  try {
    const userDoc = db.collection("users").doc(userId);
    await userDoc.set({ totalBudget: amount }, { merge: true }); // Merge to avoid overwriting other fields
    return amount;
  } catch (error) {
    console.error("Error setting total budget:", error.message);
    throw new Error("Failed to set total budget.");
  }
};

// Update the total budget for a specific user
export const updateTotalBudget = async (userId, amount) => {
  if (typeof amount !== "number") {
    throw new Error("The budget must be a number!");
  }

  try {
    const userDoc = db.collection("users").doc(userId);
    await userDoc.update({ totalBudget: amount });
    return amount;
  } catch (error) {
    console.error("Error updating total budget:", error.message);
    throw new Error("Failed to update total budget.");
  }
};
