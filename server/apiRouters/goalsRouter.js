import express from "express";
import {
  getAllGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteAbandonedGoal,
  deleteCompletedGoal,
} from "../goal.js";

export const goalsRouter = express.Router();

goalsRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

goalsRouter.get("/", async (req, res) => {
  try {
    const goals = await getAllGoals(req.userId);
    res.status(200).json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

goalsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const goal = await getGoalById(req.userId, id);
    if (goal) {
      res.status(200).json(goal);
    } else {
      res.status(404).send({ error: "Goal not found" });
    }
  } catch (error) {
    console.error("Error fetching goal by ID:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

goalsRouter.post("/", async (req, res) => {
  const { name, goalAmount, deadline, accumulated, description } = req.body;
  if (!name || !goalAmount) {
    return res.status(400).send({ error: "Invalid goal data" });
  }

  try {
    const newGoal = await createGoal(
      req.userId,
      name,
      goalAmount,
      deadline,
      accumulated,
      description,
    );
    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Error creating goal:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

goalsRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, goalAmount, deadline, accumulated, description } = req.body;

  try {
    const updatedGoal = await updateGoal(
      req.userId,
      id,
      name,
      goalAmount,
      deadline,
      accumulated,
      description,
    );
    res.status(200).json(updatedGoal);
  } catch (error) {
    console.error("Error updating goal:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

goalsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { abandoned } = req.query;

  try {
    if (abandoned === "true") {
      await deleteAbandonedGoal(req.userId, id);
    } else {
      await deleteCompletedGoal(req.userId, id);
    }
    res.status(200).json({ success: true, id });
  } catch (error) {
    console.error("Error deleting goal:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

export default goalsRouter;
