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
    const envelopeCollectionRef = userRef.collection("envelopes");
    const envelopeMetadataRef = envelopeCollectionRef.doc("metadata");
    const incomeRef = userRef.collection("income").doc("regularIncome");
    const shortTermRef = userRef.collection("savings").doc("shortTermSavings");
    const longTermRef = userRef.collection("savings").doc("longTermSavings");

    const [envelopeMetadataDoc, incomeDoc, shortTermDoc, longTermDoc] =
      await Promise.all([
        envelopeMetadataRef.get(),
        incomeRef.get(),
        shortTermRef.get(),
        longTermRef.get(),
      ]);

    if (!envelopeMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }
    if (!incomeDoc.exists) {
      throw new Error("Regular income document not found.");
    }
    if (!shortTermDoc.exists || !longTermDoc.exists) {
      throw new Error("Savings documents not found.");
    }

    const {
      nextEnvelopeId = 1,
      count,
      budgetSum = 0,
    } = envelopeMetadataDoc.data();
    const regularIncome = incomeDoc.data().value;
    const newBudget = parseFloat(budget);
    const amountNeeded = parseFloat(currentAmount);

    // Check if new total budget exceeds regular income
    if (budgetSum + newBudget > regularIncome) {
      throw new Error(
        "Total envelope budgets exceed available regular income.",
      );
    }

    // Check and deduct funds from savings
    let shortTermSavings = shortTermDoc.data().currentAmount;
    let longTermSavings = longTermDoc.data().currentAmount;

    if (amountNeeded > shortTermSavings + longTermSavings) {
      throw new Error(
        "Not enough funds in savings to cover the initial amount.",
      );
    }

    let remainingAmount = amountNeeded;

    if (remainingAmount <= shortTermSavings) {
      // Deduct entirely from short-term savings
      shortTermSavings -= remainingAmount;
      remainingAmount = 0;
    } else {
      // Use up short-term savings first, then take from long-term
      remainingAmount -= shortTermSavings;
      shortTermSavings = 0;
      longTermSavings -= remainingAmount;
    }

    const envelopeRef = envelopeCollectionRef.doc(String(nextEnvelopeId));
    const newEnvelope = {
      id: nextEnvelopeId,
      name,
      budget: newBudget,
      currentAmount: amountNeeded,
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
      budgetSum: budgetSum + newBudget,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update savings with the new amounts
    batch.update(shortTermRef, { currentAmount: shortTermSavings });
    batch.update(longTermRef, { currentAmount: longTermSavings });

    await batch.commit();

    return newEnvelope;
  } catch (error) {
    console.error("Error creating envelope:", error);
    throw new Error(error.message || "Failed to create the envelope.");
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
    const incomeRef = userRef.collection("income").doc("regularIncome");
    const shortTermRef = userRef.collection("savings").doc("shortTermSavings");
    const longTermRef = userRef.collection("savings").doc("longTermSavings");

    const [
      envelopeMetadataDoc,
      incomeDoc,
      envelopeDoc,
      shortTermDoc,
      longTermDoc,
    ] = await Promise.all([
      envelopeMetadataRef.get(),
      incomeRef.get(),
      envelopesRef.doc(envelopeId).get(),
      shortTermRef.get(),
      longTermRef.get(),
    ]);

    if (
      !envelopeMetadataDoc.exists ||
      !incomeDoc.exists ||
      !envelopeDoc.exists ||
      !shortTermDoc.exists ||
      !longTermDoc.exists
    ) {
      throw new Error("Required document(s) not found.");
    }

    const { count, budgetSum = 0 } = envelopeMetadataDoc.data();
    const regularIncome = incomeDoc.data().value;
    const envelopeData = envelopeDoc.data();
    const currentOrder = envelopeData.order;
    const currentBudget = envelopeData.budget;
    const currentAmount = envelopeData.currentAmount;

    const updatedBudget =
      newBudget !== undefined ? parseFloat(newBudget) : currentBudget;
    const updatedAmount =
      newCurrentAmount !== undefined
        ? parseFloat(newCurrentAmount)
        : currentAmount;
    const newTotalBudget = budgetSum - currentBudget + updatedBudget;
    if (newTotalBudget > regularIncome) {
      throw new Error(
        "Total envelope budgets exceed available regular income.",
      );
    }

    if (newOrder < 1 || newOrder > count || !Number.isInteger(newOrder)) {
      throw new Error(
        `Invalid order number. It must be a positive integer between 1 and ${count}.`,
      );
    }

    let shortTermSavings = shortTermDoc.data().currentAmount;
    let longTermSavings = longTermDoc.data().currentAmount;
    let remainingAmount = updatedAmount - currentAmount;

    if (remainingAmount > 0) {
      if (remainingAmount > shortTermSavings + longTermSavings) {
        throw new Error("Not enough funds in savings to cover the increase.");
      }
      if (remainingAmount <= shortTermSavings) {
        shortTermSavings -= remainingAmount;
      } else {
        remainingAmount -= shortTermSavings;
        shortTermSavings = 0;
        longTermSavings -= remainingAmount;
      }
    } else if (remainingAmount < 0) {
      shortTermSavings += Math.abs(remainingAmount);
    }

    const batch = db.batch();
    if (newOrder !== currentOrder) {
      const envelopesToUpdate = await envelopesRef
        .where("order", ">=", Math.min(newOrder, currentOrder))
        .where("order", "<=", Math.max(newOrder, currentOrder))
        .get();
      envelopesToUpdate.forEach((doc) => {
        const updatedOrder =
          doc.data().order + (newOrder < currentOrder ? 1 : -1);
        batch.update(doc.ref, { order: updatedOrder });
      });
      batch.update(envelopesRef.doc(envelopeId), { order: newOrder });
    }

    const updates = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      newBudget,
      newCurrentAmount,
      newDescription,
      newColor,
      name: newName,
    };
    batch.update(envelopesRef.doc(envelopeId), updates);
    batch.update(envelopeMetadataRef, { budgetSum: newTotalBudget });
    batch.update(shortTermRef, { currentAmount: shortTermSavings });
    batch.update(longTermRef, { currentAmount: longTermSavings });

    await batch.commit();
    return { id: envelopeId, ...updates, order: newOrder };
  } catch (error) {
    console.error("Error updating envelope:", error);
    throw new Error("Failed to update the envelope.");
  }
};

export const batchUpdateEnvelopeOrders = async (userId, updatedEnvelopes) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const envelopesRef = userRef.collection("envelopes");
    const envelopeMetadataRef = userRef.collection("envelopes").doc("metadata");

    // Get envelope metadata
    const envelopeMetadataDoc = await envelopeMetadataRef.get();
    if (!envelopeMetadataDoc.exists) throw new Error("Envelope metadata not found.");
    const { count } = envelopeMetadataDoc.data();

    // Validate order values
    const orderSet = new Set();
    updatedEnvelopes.forEach((envelope) => {
      if (!Number.isInteger(envelope.id) || !Number.isInteger(envelope.newOrder)) {
        throw new Error("Envelope ID and newOrder must be integers.");
      }
      envelope.id = envelope.id.toString(); // .doc() below requires a string argument

      if (envelope.newOrder < 1 || envelope.newOrder > count) {
        throw new Error(`Invalid order number ${envelope.newOrder}. Must be between 1 and ${count}.`);
      }
      if (orderSet.has(envelope.newOrder)) {
        throw new Error(`Duplicate order number found: ${envelope.newOrder}.`);
      }
      orderSet.add(envelope.newOrder);
    });

    // Ensure all numbers from 1 to count are present
    for (let i = 1; i <= count; i++) {
      if (!orderSet.has(i)) {
        throw new Error(`Missing order number ${i}. Order sequence must be continuous.`);
      }
    }

    const batch = db.batch();

    // Update each envelope's order
    for (const { id, newOrder } of updatedEnvelopes) {
      const envelopeRef = envelopesRef.doc(id); // here it is
      batch.update(envelopeRef, {
        order: newOrder,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error in batch order update:", error);
    throw new Error("Failed to update envelope orders.");
  }
};


// Delete an envelope for a user
export const deleteEnvelope = async (userId, envelopeId) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const envelopeMetadataRef = userRef.collection("envelopes").doc("metadata");
    const envelopeRef = userRef.collection("envelopes").doc(envelopeId);
    const shortTermRef = userRef.collection("savings").doc("shortTermSavings");

    const [envelopeMetadataDoc, envelopeDoc, shortTermDoc] = await Promise.all([
      envelopeMetadataRef.get(),
      envelopeRef.get(),
      shortTermRef.get(),
    ]);

    if (
      !envelopeMetadataDoc.exists ||
      !envelopeDoc.exists ||
      !shortTermDoc.exists
    ) {
      throw new Error("Required document(s) not found.");
    }

    const { count, budgetSum = 0 } = envelopeMetadataDoc.data();
    const envelopeData = envelopeDoc.data();
    const envelopeOrder = envelopeData.order;
    const envelopeBudget = envelopeData.budget;
    const envelopeCurrentAmount = envelopeData.currentAmount;
    const newTotalBudget = budgetSum - envelopeBudget;
    const shortTermSavings = shortTermDoc.data().currentAmount || 0;
    const updatedShortTermSavings = shortTermSavings + envelopeCurrentAmount;

    const envelopesRef = userRef.collection("envelopes");
    const envelopesSnapshot = await envelopesRef
      .where("order", ">", envelopeOrder)
      .get();
    const batch = db.batch();
    envelopesSnapshot.docs.forEach((doc) =>
      batch.update(doc.ref, { order: doc.data().order - 1 }),
    );

    batch.delete(envelopeRef);
    batch.update(envelopeMetadataRef, {
      count: count - 1,
      budgetSum: newTotalBudget,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(shortTermRef, { currentAmount: updatedShortTermSavings });
    await batch.commit();
  } catch (error) {
    console.error("Error deleting envelope:", error);
    throw new Error("Failed to delete the envelope.");
  }
};

export const batchDeleteEnvelopes = async (userId, deletedEnvelopeIds) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const envelopeMetadataRef = userRef.collection("envelopes").doc("metadata");
    const envelopesRef = userRef.collection("envelopes");
    const shortTermRef = userRef.collection("savings").doc("shortTermSavings");

    const [envelopeMetadataDoc, shortTermDoc, envelopesSnapshot] =
      await Promise.all([
        envelopeMetadataRef.get(),
        shortTermRef.get(),
        envelopesRef.orderBy("order").get(), // Ensure ordered retrieval
      ]);

    if (!envelopeMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }
    if (!shortTermDoc.exists) {
      throw new Error("Short-term savings document not found.");
    }

    let { budgetSum = 0 } = envelopeMetadataDoc.data();
    let shortTermSavings = shortTermDoc.data().currentAmount;
    let newTotalBudget = budgetSum;

    const batch = db.batch();
    let deletedBudgets = 0;
    let deletedAmounts = 0;
    
    let envelopes = envelopesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Create a new order list that skips deleted envelopes
    let newOrderList = [];
    let orderCounter = 1;

    envelopes.forEach((env) => {
      if (deletedEnvelopeIds.includes(env.id)) {
        deletedBudgets += env.budget;
        deletedAmounts += env.currentAmount;
        batch.delete(envelopesRef.doc(env.id.toString()));
      } else {
        newOrderList.push({ id: env.id, newOrder: orderCounter++ });
      }
    });

    newTotalBudget -= deletedBudgets;
    shortTermSavings += deletedAmounts;

    // Apply new order values
    newOrderList.forEach(({ id, newOrder }) => {
      batch.update(envelopesRef.doc(id.toString()), { order: newOrder });
    });

    batch.update(envelopeMetadataRef, {
      count: newOrderList.length,
      budgetSum: newTotalBudget,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    batch.update(shortTermRef, { currentAmount: shortTermSavings });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error in batch deletion:", error);
    throw new Error("Failed to delete envelopes.");
  }
};
