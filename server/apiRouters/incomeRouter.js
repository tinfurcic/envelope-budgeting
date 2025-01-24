import express from "express";
import { getIncome, updateIncomeType, updateIncome } from "../income.js";

export const incomeRouter = express.Router();

incomeRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

// GET all income
incomeRouter.get("/", async (req, res) => {
  try {
    const income = await getIncome(req.userId);
    res.status(200).json(income);
  } catch (error) {
    console.error("Error fetching income:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH to update both income types in a single request
incomeRouter.patch("/", async (req, res) => {
  const { regularIncome, extraIncome } = req.body;

  // Ensure both fields are provided
  if (regularIncome === undefined || extraIncome === undefined) {
    return res
      .status(400)
      .json({ error: "'regularIncome' and 'extraIncome' must be provided." });
  }

  // Ensure both fields are numbers
  if (isNaN(regularIncome) || isNaN(extraIncome)) {
    return res
      .status(400)
      .json({
        error:
          "Invalid values. 'regularIncome' and 'extraIncome' must be numbers.",
      });
  }

  try {
    // Update both income types simultaneously
    const updatedIncome = await updateIncome(
      req.userId,
      regularIncome,
      extraIncome,
    );
    res.status(200).json(updatedIncome);
  } catch (error) {
    console.error("Error updating income:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH to update a specific income type
// Isn't used on the front end
incomeRouter.patch("/:incomeType", async (req, res) => {
  const { incomeType } = req.params;
  const { value } = req.body;

  const allowedIncomeTypes = ["regularIncome", "extraIncome"];
  if (!allowedIncomeTypes.includes(incomeType)) {
    return res.status(400).json({ error: "Invalid incomeType." });
  }

  if (isNaN(value)) {
    return res.status(400).json({ error: "Invalid value. Must be a number." });
  }

  try {
    const updatedIncome = await updateIncomeType(req.userId, incomeType, value);
    res.status(200).json(updatedIncome);
  } catch (error) {
    console.error("Error updating income:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default incomeRouter;
