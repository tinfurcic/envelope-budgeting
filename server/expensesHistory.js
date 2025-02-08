import { db } from "../firebase-admin.js";

// Fetch all expenses
export async function getAllExpensesHistory(userId) {
  try {
    const snapshot = await db
      .collection("users")
      .doc(userId)
      .collection("expensesHistory")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching expenses history:", error);
    throw new Error("Failed to fetch expenses history");
  }
}

// Fetch expense history for a specific month
export async function getExpensesInMonth(userId, month) {
  try {
    const docRef = db
      .collection("users")
      .doc(userId)
      .collection("expensesHistory")
      .doc(month);
    const doc = await docRef.get();
    return doc.exists ? doc.data().expenses : [];
  } catch (error) {
    console.error(`Error fetching expenses for ${month}:`, error);
    throw new Error(`Failed to fetch expenses for ${month}`);
  }
}

export async function archiveExpenses(userId, month) {
  const expensesRef = db.collection("users").doc(userId).collection("expenses");
  const historyRef = db
    .collection("users")
    .doc(userId)
    .collection("expensesHistory")
    .doc(month);

  try {
    // Get current date in YYYY-MM format
    const currentDate = new Date();
    const currentMonth =
      currentDate.getFullYear() +
      "-" +
      (currentDate.getMonth() + 1).toString().padStart(2, "0");

    // Check if the provided month is in the past
    if (month >= currentMonth) {
      return {
        success: false,
        error: "You can only archive expenses for past months.",
      };
    }

    const snapshot = await expensesRef.get();
    const allExpenses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const monthExpenses = allExpenses.filter((expense) =>
      expense.date.startsWith(month),
    );

    if (monthExpenses.length === 0) {
      return { success: true, message: "No expenses found for this month." };
    }

    // Ensure all expenses are locked in
    if (monthExpenses.some((expense) => expense.isLockedIn !== true)) {
      return { success: false, error: "Not all expenses are locked." };
    }

    await db.runTransaction(async (transaction) => {
      // Archive the expenses and add them to the history collection
      monthExpenses.forEach(async (expense) => {
        const expenseRef = expensesRef.doc(expense.id);

        // Check if the document still exists before updating
        const expenseDoc = await transaction.get(expenseRef);
        if (expenseDoc.exists) {
          transaction.update(expenseRef, { archived: true });
        } else {
          console.log(
            `Expense ${expense.id} has been deleted and cannot be archived.`,
          );
        }
      });

      // Add the expenses to the history collection (merge to prevent overwriting)
      transaction.set(historyRef, { expenses: monthExpenses }, { merge: true });
    });

    return {
      success: true,
      message: `Successfully archived ${monthExpenses.length} expenses for ${month}.`,
    };
  } catch (error) {
    console.error("Error archiving expenses:", error);
    throw new Error(`Failed to archive expenses: ${error.message}`);
  }
}

// Delete all expense history (development only)
export async function deleteAllExpenseHistory(userId) {
  try {
    const historyRef = db
      .collection("users")
      .doc(userId)
      .collection("expensesHistory");
    const snapshot = await historyRef.get();

    if (snapshot.empty)
      return { success: true, message: "No expense history found." };

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return { success: true, message: `Deleted all expense history.` };
  } catch (error) {
    console.error("Error deleting all expense history:", error);
    throw new Error("Failed to delete all expense history");
  }
}

// Delete expense history for a single month (development only)
export async function deleteExpenseHistoryForMonth(userId, month) {
  try {
    const historyRef = db
      .collection("users")
      .doc(userId)
      .collection("expensesHistory")
      .doc(month);
    const doc = await historyRef.get();

    if (!doc.exists)
      return {
        success: true,
        message: `No expense history found for ${month}.`,
      };

    await historyRef.delete();
    return { success: true, message: `Deleted expense history for ${month}.` };
  } catch (error) {
    console.error(`Error deleting expense history for ${month}:`, error);
    throw new Error(`Failed to delete expense history for ${month}`);
  }
}
