import express from "express";
import {
  getTotalBudget,
  setTotalBudget,
  updateTotalBudget,
} from "../budget.js";

export const budgetRouter = express.Router();

// Endpoint to get the total budget
budgetRouter.get("/", async (req, res) => {
  try {
    const totalBudget = await getTotalBudget();
    res.status(200).json({ totalBudget });
  } catch (error) {
    console.error("Error fetching total budget:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to set the total budget
budgetRouter.post("/", async (req, res) => {
  const { totalBudget } = req.body;
  if (!totalBudget || isNaN(totalBudget)) {
    return res.status(400).send({ error: "Invalid total budget value" });
  }

  try {
    const newBudget = await setTotalBudget(parseFloat(totalBudget));
    res.status(201).json({ totalBudget: newBudget });
  } catch (error) {
    console.error("Error setting total budget:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to update the total budget
budgetRouter.patch("/", async (req, res) => {
  const { totalBudget } = req.body;
  if (!totalBudget || isNaN(totalBudget)) {
    return res.status(400).send({ error: "Invalid total budget value" });
  }

  try {
    const updatedBudget = await updateTotalBudget(parseFloat(totalBudget));
    res.status(200).json({ totalBudget: updatedBudget });
  } catch (error) {
    console.error("Error updating total budget:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default budgetRouter;
