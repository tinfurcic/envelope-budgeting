import { db } from "../firebase-admin.js";

// Get all goals for a specific user
export const getAllGoals = async (userId) => {
  try {
    const goalsRef = db.collection("users").doc(userId).collection("goals");
    const querySnapshot = await goalsRef
      .where("__name__", "!=", "metadata")
      .get();

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching all goals:", error);
    throw new Error("Failed to fetch goals.");
  }
};

// Get a specific goal by ID for a user
export const getGoalById = async (userId, goalId) => {
  try {
    const goalRef = db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId);
    const goalDoc = await goalRef.get();

    if (!goalDoc.exists) {
      return null;
    }

    return { id: goalDoc.id, ...goalDoc.data() };
  } catch (error) {
    console.error("Error fetching goal by ID:", error.message);
    throw new Error("Failed to fetch the goal.");
  }
};

// Create a new goal for a user
// By adding `|| ""` after a property, I can make sending through request body optional
// It's probably better to make user actions pass some values by default
export const createGoal = async (
  userId,
  goalAmount,
  deadline,
  monthlyAmount,
  description,
) => {
  try {
    const userRef = db.collection("users").doc(userId);
    const goalsMetadataRef = userRef.collection("goals").doc("metadata");
    const goalsMetadataDoc = await goalsMetadataRef.get();

    if (!goalsMetadataDoc.exists) {
      throw new Error("Metadata not found.");
    }

    const { nextGoalId = 1 } = goalsMetadataDoc.data();

    const goalsRef = userRef.collection("goals").doc(String(nextGoalId));

    const newGoal = {
      id: nextGoalId,
      goalAmount: parseFloat(goalAmount),
      deadline,
      monthlyAmount: parseFloat(monthlyAmount),
      description: description,
      createdAt: new Date().toISOString(),
    };

    const batch = db.batch();
    batch.set(goalsRef, newGoal);
    batch.update(goalsMetadataRef, { nextGoalId: nextGoalId + 1 });

    await batch.commit();

    return newGoal;
  } catch (error) {
    console.error("Error creating goal:", error);
    throw new Error("Failed to create the goal.");
  }
};

// Update a goal for a user
export const updateGoal = async (
  userId,
  goalId,
  goalAmount,
  deadline,
  monthlyAmount,
  description,
) => {
  try {
    const updates = {};
    if (goalAmount !== undefined) updates.goalAmount = parseFloat(goalAmount);
    if (deadline !== undefined) updates.deadline = deadline;
    if (monthlyAmount !== undefined)
      updates.monthlyAmount = parseFloat(monthlyAmount);
    if (description !== undefined) updates.description = description;

    const goalRef = db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId);
    await goalRef.update(updates);

    return { id: goalId, ...updates };
  } catch (error) {
    console.error("Error updating goal:", error);
    throw new Error("Failed to update the goal.");
  }
};

// Delete a goal for a user
export const deleteGoal = async (userId, goalId) => {
  try {
    const goalRef = db
      .collection("users")
      .doc(userId)
      .collection("goals")
      .doc(goalId);
    await goalRef.delete();
  } catch (error) {
    console.error("Error deleting goal (Admin SDK):", error);
    throw new Error("Failed to delete the goal.");
  }
};
