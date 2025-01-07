import { db } from "../firebase-admin.js";
const budgetDoc = db.collection("settings").doc("budget");

export const getTotalBudget = async () => {
  try {
    const docSnapshot = await budgetDoc.get();
    if (docSnapshot.exists) {
      return docSnapshot.data().totalBudget;
    } else {
      throw new Error("Budget document does not exist.");
    }
  } catch (error) {
    console.error("Error fetching total budget:", error);
    throw new Error("Failed to fetch total budget.");
  }
};

export const setTotalBudget = async (amount) => {
  if (typeof amount !== "number") {
    throw new Error("The budget must be a number!");
  }

  try {
    await budgetDoc.set({ totalBudget: amount });
    return amount;
  } catch (error) {
    console.error("Error setting total budget:", error);
    throw new Error("Failed to set total budget.");
  }
};

export const updateTotalBudget = async (amount) => {
  if (typeof amount !== "number") {
    throw new Error("The budget must be a number!");
  }

  try {
    await budgetDoc.update({ totalBudget: amount });
    return amount;
  } catch (error) {
    console.error("Error updating total budget:", error);
    throw new Error("Failed to update total budget.");
  }
};
