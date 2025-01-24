import express from "express";
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../expense.js";

export const expensesRouter = express.Router();

expensesRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

expensesRouter.get("/", async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.userId);
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

expensesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const expense = await getExpenseById(req.userId, id);
    if (expense) {
      res.status(200).json(expense);
    } else {
      res.status(404).send({ error: "Expense not found" });
    }
  } catch (error) {
    console.error("Error fetching expense by ID:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

expensesRouter.post("/", async (req, res) => {
  const { amount, date, source, description, isLockedIn } = req.body;
  if (isNaN(amount) || !date || !source || (isLockedIn !== true && isLockedIn !== false)) {
    // You might want to make all properties mandatory, and just pass default/insignificant values if they don't matter
    return res.status(400).send({ error: "Invalid expense data" });
  }

  try {
    const newExpense = await createExpense(
      req.userId,
      amount,
      date,
      source, // "e:id" for envelopes, "STS" / "LTS" for short/long term savings?
      description,
      isLockedIn,
    );
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error creating expense:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

expensesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { amount, date, source, description, isLockedIn } = req.body;

  try {
    const updatedExpense = await updateExpense(
      req.userId,
      id,
      amount,
      date,
      source,
      description,
      isLockedIn,
    );
    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

expensesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteExpense(req.userId, id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting expense:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default expensesRouter;
