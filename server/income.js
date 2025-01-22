import { db } from "../firebase-admin.js";

// Get all income for a user
export const getIncome = async (userId) => {
  try {
    const incomeSnapshot = await db.collection("users").doc(userId).collection("income").get();

    if (incomeSnapshot.empty) {
      console.log("No income documents found for user:", userId);
    }

    const income = {};
    incomeSnapshot.forEach((doc) => {
      console.log(`Income doc found: ${doc.id} -> ${doc.data().value}`);
      income[doc.id] = doc.data().value || 0;
    });

    return income;
  } catch (error) {
    console.error("Error fetching income:", error.message);
    throw new Error("Failed to fetch income.");
  }
};


export const updateIncome = async (userId, regularIncome, extraIncome) => {
  try {
    const incomeRef = db.collection("users").doc(userId).collection("income");

    // Set both income fields in the income collection
    await Promise.all([
      incomeRef.doc("regularIncome").set({ value: parseFloat(regularIncome) }, { merge: true }),
      incomeRef.doc("extraIncome").set({ value: parseFloat(extraIncome) }, { merge: true }),
    ]);

    return { regularIncome, extraIncome };
  } catch (error) {
    console.error("Error updating income:", error.message);
    throw new Error("Failed to update income.");
  }
};

// Update a specific income type
// Isn't used on the front end
export const updateIncomeType = async (userId, incomeType, value) => {
  try {
    const incomeRef = db.collection("users").doc(userId).collection("income").doc(incomeType);
    await incomeRef.set({ value: parseFloat(value) }, { merge: true });

    return { [incomeType]: value };
  } catch (error) {
    console.error("Error updating income:", error.message);
    throw new Error("Failed to update income.");
  }
};
