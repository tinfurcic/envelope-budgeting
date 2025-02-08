import { db } from "../firebase-admin.js";
import admin from "firebase-admin";

const computeSourceChanges = (oldSources, newSources) => {
  const changes = [];
  const sourceMap = new Map();

  newSources.forEach((source) =>
    sourceMap.set(`${source.type}-${source.id}`, source.amount),
  );

  // Computing differences
  oldSources.forEach((oldSource) => {
    const key = `${oldSource.type}-${oldSource.id}`;
    const newAmount = sourceMap.get(key) || 0; // 0 if the source is not in newSources
    const diff = oldSource.amount - newAmount; // The difference between old and new amounts

    changes.push({ source: oldSource, amountDiff: diff });

    // Remove the source from the map to avoid double-processing
    sourceMap.delete(key);
  });

  // Handling sources that were added in the new sources but were not in the old sources
  sourceMap.forEach((amount, key) => {
    const [type, id] = key.split("-");
    changes.push({
      source: { type, id: Number(id), amount },
      amountDiff: -amount,
    }); // Handle new sources as negative difference
  });

  return changes;
};

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

// New expense. Also handles spending. Much wow.
export const createExpense = async (
  userId,
  amount,
  date,
  sources,
  description,
  isLockedIn,
) => {
  const userRef = db.collection("users").doc(userId);
  const envelopesRef = userRef.collection("envelopes");
  const savingsRef = userRef.collection("savings");
  const expenseMetadataRef = userRef.collection("expenses").doc("metadata");

  try {
    const transaction = await db.runTransaction(async (t) => {
      const expenseMetadataDoc = await t.get(expenseMetadataRef);
      if (!expenseMetadataDoc.exists) {
        throw new Error("Metadata not found.");
      }

      const { nextExpenseId = 1 } = expenseMetadataDoc.data();
      const expenseRef = userRef
        .collection("expenses")
        .doc(String(nextExpenseId));

      let newShortTermSavings = null;
      let newLongTermSavings = null;

      // Validate the total amount from sources
      const totalFromSources = sources.reduce(
        (sum, source) => sum + Number(source.amount),
        0,
      );
      if (totalFromSources !== amount) {
        throw new Error("Amounts from sources don't add up to total expense!");
      }

      // Collect data for sources before any updates (all reads here)
      const envelopeDocs = [];
      const savingsDocs = [];

      for (const source of sources) {
        if (source.type === "envelope") {
          const envelopeRef = envelopesRef.doc(String(source.id));
          const envelopeDoc = await t.get(envelopeRef);
          if (!envelopeDoc.exists) {
            throw new Error(`Envelope with ID ${source.id} not found.`);
          }
          envelopeDocs.push({
            source,
            envelopeData: envelopeDoc.data(),
            envelopeRef,
          });
        } else if (
          source.type === "shortTermSavings" ||
          source.type === "longTermSavings"
        ) {
          const savingsDocRef = savingsRef.doc(source.type);
          const savingsDoc = await t.get(savingsDocRef);
          if (!savingsDoc.exists) {
            throw new Error(`Savings document "${source.type}" not found.`);
          }
          savingsDocs.push({ source, savingsData: savingsDoc.data() });
        }
      }

      // Process each source and calculate updates (all writes here)
      for (const { source, envelopeData, envelopeRef } of envelopeDocs) {
        if (Number(source.amount) > envelopeData.currentAmount) {
          throw new Error(`Not enough funds in envelope "${source.name}".`);
        }
        t.update(envelopeRef, {
          currentAmount: envelopeData.currentAmount - Number(source.amount),
        });
      }

      for (const { source, savingsData } of savingsDocs) {
        if (Number(source.amount) > savingsData.value) {
          throw new Error(`Not enough funds in "${source.name}".`);
        }

        // Deduct from savings (store new values to update after loop)
        if (source.type === "shortTermSavings") {
          newShortTermSavings = savingsData.value - Number(source.amount);
        } else {
          newLongTermSavings = savingsData.value - Number(source.amount);
        }
      }

      // Apply savings updates if necessary
      if (newShortTermSavings !== null) {
        t.update(savingsRef.doc("shortTermSavings"), {
          value: newShortTermSavings,
        });
      }
      if (newLongTermSavings !== null) {
        t.update(savingsRef.doc("longTermSavings"), {
          value: newLongTermSavings,
        });
      }

      // Create the new expense object
      const newExpense = {
        id: nextExpenseId,
        amount: parseFloat(amount),
        date,
        sources,
        description,
        isLockedIn,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      // Set the new expense document
      t.set(expenseRef, newExpense);
      t.update(expenseMetadataRef, {
        nextExpenseId: nextExpenseId + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true, data: newExpense };
    });

    return transaction;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw new Error("Failed to create expense.");
  }
};

// Update expense. Also handles refunds and stuff. Crazy.
export const updateExpense = async (
  userId,
  expenseId,
  newAmount,
  newDate,
  newSources,
  newDescription,
) => {
  const userRef = db.collection("users").doc(userId);
  const envelopesRef = userRef.collection("envelopes");
  const savingsRef = userRef.collection("savings");
  const expenseRef = userRef.collection("expenses").doc(String(expenseId));

  try {
    await db.runTransaction(async (t) => {
      const expenseDoc = await t.get(expenseRef);
      if (!expenseDoc.exists) {
        throw new Error("Expense not found.");
      }
      const oldExpense = expenseDoc.data();
      if (oldExpense.isLockedIn) {
        throw new Error("Cannot update a locked-in expense.");
      }
      const oldSources = oldExpense.sources;
      const changes = computeSourceChanges(oldSources, newSources);

      const totalFromNewSources = newSources.reduce(
        (sum, source) => sum + Number(source.amount),
        0,
      );
      if (totalFromNewSources !== newAmount) {
        throw new Error("Amounts from sources don't add up to total expense!");
      }

      const envelopeDocs = [];
      const savingsDocs = [];

      // reading envelopes
      for (const { source } of changes) {
        if (source.type === "envelope") {
          const envelopeRef = envelopesRef.doc(String(source.id));
          envelopeDocs.push(t.get(envelopeRef)); // Add the read to the batch
        }
      }

      // reading savings
      for (const { source } of changes) {
        if (
          source.type === "shortTermSavings" ||
          source.type === "longTermSavings"
        ) {
          const savingsRefDoc = savingsRef.doc(source.type);
          savingsDocs.push(t.get(savingsRefDoc)); // Add the read to the batch
        }
      }

      // actually reading
      const [envelopeDocsData, savingsDocsData] = await Promise.all([
        Promise.all(envelopeDocs),
        Promise.all(savingsDocs),
      ]);

      // writing
      for (const { source, amountDiff } of changes) {
        if (source.type === "envelope") {
          const envelopeDoc = envelopeDocsData.find(
            (doc) => doc.id === String(source.id),
          );
          if (!envelopeDoc.exists)
            throw new Error(`Envelope ${source.name} not found.`);
          const currentAmount = envelopeDoc.data().currentAmount;
          if (currentAmount + amountDiff < 0) {
            throw new Error(`Not enough funds in envelope ${source.name}.`);
          }
          t.update(envelopesRef.doc(String(source.id)), {
            currentAmount: currentAmount + amountDiff,
          });
        } else if (
          source.type === "shortTermSavings" ||
          source.type === "longTermSavings"
        ) {
          const savingsDoc = savingsDocsData.find(
            (doc) => doc.id === source.type,
          );
          if (!savingsDoc.exists)
            throw new Error(`Savings ${source.name} not found.`);
          const currentValue = savingsDoc.data().value;
          if (currentValue + amountDiff < 0) {
            throw new Error(`Not enough funds in ${source.name}.`);
          }
          t.update(savingsRef.doc(source.type), {
            value: currentValue + amountDiff,
          });
        }
      }

      t.update(expenseRef, {
        amount: newAmount,
        date: newDate,
        sources: newSources,
        description: newDescription,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense.");
  }
};

// Delete an expense for a user
export const deleteExpense = async (userId, expenseId) => {
  const userRef = db.collection("users").doc(userId);
  const envelopesRef = userRef.collection("envelopes");
  const savingsRef = userRef.collection("savings");
  const expenseRef = userRef.collection("expenses").doc(String(expenseId));

  try {
    const transaction = await db.runTransaction(async (t) => {
      const expenseDoc = await t.get(expenseRef);
      if (!expenseDoc.exists) {
        throw new Error("Expense not found.");
      }

      const { sources } = expenseDoc.data();
      let newShortTermSavings = null;
      let newLongTermSavings = null;

      const envelopeDocs = [];
      const savingsDocs = [];

      // reading
      for (const source of sources) {
        if (source.type === "envelope") {
          const envelopeRef = envelopesRef.doc(String(source.id));
          const envelopeDoc = await t.get(envelopeRef);
          if (!envelopeDoc.exists) {
            throw new Error(`Envelope with ID ${source.id} not found.`);
          }
          envelopeDocs.push({
            source,
            envelopeData: envelopeDoc.data(),
            envelopeRef,
          });
        } else if (
          source.type === "shortTermSavings" ||
          source.type === "longTermSavings"
        ) {
          const savingsDocRef = savingsRef.doc(source.type);
          const savingsDoc = await t.get(savingsDocRef);
          if (!savingsDoc.exists) {
            throw new Error(`Savings document "${source.type}" not found.`);
          }
          savingsDocs.push({ source, savingsData: savingsDoc.data() });
        }
      }

      // writing
      for (const { source, envelopeData, envelopeRef } of envelopeDocs) {
        t.update(envelopeRef, {
          currentAmount: envelopeData.currentAmount + Number(source.amount),
        });
      }

      for (const { source, savingsData } of savingsDocs) {
        if (source.type === "shortTermSavings") {
          newShortTermSavings = savingsData.value + Number(source.amount);
        } else {
          newLongTermSavings = savingsData.value + Number(source.amount);
        }
      }

      if (newShortTermSavings !== null) {
        t.update(savingsRef.doc("shortTermSavings"), {
          value: newShortTermSavings,
        });
      }
      if (newLongTermSavings !== null) {
        t.update(savingsRef.doc("longTermSavings"), {
          value: newLongTermSavings,
        });
      }

      // Deleting
      t.delete(expenseRef);

      return { success: true, message: "Expense deleted and funds refunded." };
    });

    return transaction;
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense.");
  }
};

// delete expenses that are already in history
export async function deleteArchivedExpenses(userId, month) {
  const expensesRef = db.collection("users").doc(userId).collection("expenses");

  try {
    const snapshot = await expensesRef.where("archived", "==", true).get();
    const archivedExpenses = snapshot.docs.filter((doc) =>
      doc.data().date.startsWith(month),
    );

    if (archivedExpenses.length === 0) {
      return {
        success: true,
        message: "No archived expenses found to delete.",
      };
    }

    const batch = db.batch(); // Create a batch
    archivedExpenses.forEach((expense) => {
      batch.delete(expensesRef.doc(expense.id)); // Queue the delete operation
    });

    // Commit the batch
    await batch.commit();

    return {
      success: true,
      message: `Deleted ${archivedExpenses.length} archived expenses for ${month}.`,
    };
  } catch (error) {
    console.error(`Error deleting archived expenses for ${month}:`, error);
    throw new Error(`Failed to delete archived expenses: ${error.message}`);
  }
}

// delete everything without refunds (for development only)
export const deleteAllExpenses = async (userId) => {
  const userRef = db.collection("users").doc(userId);
  const expensesRef = userRef.collection("expenses");
  try {
    const expenses = await expensesRef.get();
    if (expenses.empty) {
      return { success: true, message: "No expenses found." };
    }
    const batch = db.batch();
    expenses.forEach((doc) => {
      if (doc.id !== "metadata") {
        batch.delete(doc.ref);
      }
    });
    await batch.commit();
    return { success: true, message: `${snapshot.size} expense(s) deleted.` };
  } catch (error) {
    console.error("Error deleting expenses:", error);
    throw new Error("Failed to delete all expenses.");
  }
};

/*
// Straightforward alternative. Refunds all, then deducts all
export const updateExpense = async ( 
  userId,
  expenseId,
  newAmount,
  newDate,
  newSources,
  newDescription,
  newIsLockedIn
) => {
  const userRef = db.collection("users").doc(userId);
  const expensesRef = userRef.collection("expenses");
  const envelopesRef = userRef.collection("envelopes");
  const savingsRef = userRef.collection("savings");
  const expenseRef = expensesRef.doc(String(expenseId));

  try {
    const transaction = await db.runTransaction(async (t) => {
      // Step 1: Read existing expense document
      const expenseDoc = await t.get(expenseRef);
      if (!expenseDoc.exists) {
        throw new Error(`Expense with ID ${expenseId} not found.`);
      }

      const oldExpense = expenseDoc.data();
      if (oldExpense.isLockedIn) {
        throw new Error("Cannot update a locked-in expense.");
      }

      // Step 2: Read all affected envelopes/savings before writing
      const allSourceRefs = new Map();

      // Collect old sources
      for (const source of oldExpense.sources) {
        if (source.type === "envelope") {
          allSourceRefs.set(`envelope-${source.id}`, envelopesRef.doc(String(source.id)));
        } else {
          allSourceRefs.set(source.type, savingsRef.doc(source.type));
        }
      }

      // Collect new sources
      for (const source of newSources) {
        if (source.type === "envelope") {
          allSourceRefs.set(`envelope-${source.id}`, envelopesRef.doc(String(source.id)));
        } else {
          allSourceRefs.set(source.type, savingsRef.doc(source.type));
        }
      }

      // Read all unique sources
      const sourceDocs = new Map();
      for (const [key, ref] of allSourceRefs) {
        const doc = await t.get(ref);
        if (!doc.exists) {
          throw new Error(`Source document ${key} not found.`);
        }
        sourceDocs.set(key, doc.data());
      }

      // Step 3: Refund old sources
      const updatedAmounts = new Map();

      for (const source of oldExpense.sources) {
        const key = source.type === "envelope" ? `envelope-${source.id}` : source.type;
        const sourceData = sourceDocs.get(key);

        if (source.type === "envelope") {
          updatedAmounts.set(key, (updatedAmounts.get(key) || sourceData.currentAmount) + source.amount);
        } else {
          updatedAmounts.set(key, (updatedAmounts.get(key) || sourceData.value) + source.amount);
        }
      }

      // Step 4: Deduct from new sources
      for (const source of newSources) {
        const key = source.type === "envelope" ? `envelope-${source.id}` : source.type;
        const sourceData = sourceDocs.get(key);

        if (source.amount > (updatedAmounts.get(key) ?? sourceData.currentAmount ?? sourceData.value)) {
          throw new Error(`Not enough funds in "${source.name}".`);
        }

        if (source.type === "envelope") {
          updatedAmounts.set(key, (updatedAmounts.get(key) || sourceData.currentAmount) - source.amount);
        } else {
          updatedAmounts.set(key, (updatedAmounts.get(key) || sourceData.value) - source.amount);
        }
      }

      // Step 5: Validate total amount
      const totalFromNewSources = newSources.reduce((sum, src) => sum + Number(src.amount), 0);
      if (totalFromNewSources !== newAmount) {
        throw new Error("Amounts from sources don't add up to total expense!");
      }

      // Step 6: Perform writes
      for (const [key, newAmount] of updatedAmounts) {
        const ref = allSourceRefs.get(key);
        if (key.startsWith("envelope-")) {
          t.update(ref, { currentAmount: newAmount });
        } else {
          t.update(ref, { value: newAmount });
        }
      }

      // Step 7: Update expense document
      const updatedExpense = {
        id: expenseId,
        amount: parseFloat(newAmount),
        date: newDate,
        sources: newSources,
        description: newDescription,
        isLockedIn: newIsLockedIn,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      t.update(expenseRef, updatedExpense);

      return { success: true, data: updatedExpense };
    });

    return transaction;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense.");
  }
};
*/
