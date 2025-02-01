import { db } from "../firebase-admin.js";

// Get all expenses for a specific user
export const getAllExpenses = async (userId) => {
  try {
    const expensesRef = db
      .collection("users")
      .doc(userId)
      .collection("expenses")
      .orderBy("id", "desc");

    const querySnapshot = await expensesRef.get();
    let metadata = null;

    const expenses = querySnapshot.docs
      .map((doc) => {
        if (doc.id === "metadata") {
          metadata = { id: doc.id, ...doc.data() };
          return null;
        }
        return { id: doc.id, ...doc.data() };
      })
      .filter(Boolean);

    return { expenses, metadata };
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw new Error("Failed to fetch expenses.");
  }
};

// Get a specific expense by ID for a user
export const getExpenseById = async (userId, expenseId) => {
  try {
    const expenseRef = db
      .collection("users")
      .doc(userId)
      .collection("expenses")
      .doc(expenseId);
    const expenseDoc = await expenseRef.get();

    if (!expenseDoc.exists) {
      return null;
    }

    return { id: expenseDoc.id, ...expenseDoc.data() };
  } catch (error) {
    console.error("Error fetching expense by ID (Admin SDK):", error.message);
    throw new Error("Failed to fetch the expense.");
  }
};

// Create a new expense for a user
// By adding `|| ""` after a property, I can make sending through request body optional
// It's probably better to make user actions pass some values by default
export const createExpense = async (
  userId,
  amount,
  date,
  source,
  description,
  isLockedIn,
) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const expenseMetadataRef = userRef.collection("expenses").doc("metadata");
    const expenseMetadataDoc = await expenseMetadataRef.get();

    if (!expenseMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }

    const { nextExpenseId = 1 } = expenseMetadataDoc.data();

    const expensesRef = userRef
      .collection("expenses")
      .doc(String(nextExpenseId));

    const newExpense = {
      id: nextExpenseId,
      amount: parseFloat(amount),
      date, // might need some conversion here
      source,
      description,
      isLockedIn,
      createdAt: new Date().toISOString(),
    };

    const batch = db.batch();
    batch.set(expensesRef, newExpense);
    batch.update(expenseMetadataRef, { nextExpenseId: nextExpenseId + 1 });

    await batch.commit();

    return newExpense;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw new Error("Failed to create expense.");
  }
};

// Update an expense for a user
export const updateExpense = async (
  userId,
  expenseId,
  amount,
  date,
  source,
  description,
  isLockedIn,
) => {
  try {
    const updates = {};
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (date) updates.date = date;
    if (source) updates.source = source;
    if (description !== undefined) updates.description = description;
    if (isLockedIn !== undefined) updates.isLockedIn = isLockedIn;

    const expenseRef = db
      .collection("users")
      .doc(userId)
      .collection("expenses")
      .doc(expenseId);
    await expenseRef.update(updates);

    return { id: expenseId, ...updates };
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense.");
  }
};

// Delete an expense for a user
export const deleteExpense = async (userId, expenseId) => {
  try {
    const expenseRef = db
      .collection("users")
      .doc(userId)
      .collection("expenses")
      .doc(expenseId);
    await expenseRef.delete();
  } catch (error) {
    console.error("Error deleting expense (Admin SDK):", error);
    throw new Error("Failed to delete expense.");
  }
};
