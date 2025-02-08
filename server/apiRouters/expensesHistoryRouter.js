import express from "express";
import {
  getAllExpensesHistory,
  getExpensesInMonth,
  archiveExpenses,
  deleteAllExpenseHistory,
  deleteExpenseHistoryForMonth,
} from "../expensesHistory.js";

export const expensesHistoryRouter = express.Router();

// Middleware to ensure the user is authenticated
expensesHistoryRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

// Get all expenses history
expensesHistoryRouter.get("/", async (req, res) => {
  try {
    const expensesHistory = await getAllExpensesHistory(req.userId);
    res.status(200).json(expensesHistory);
  } catch (error) {
    console.error("Error fetching expense history:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

// Get expense history for a specific month
expensesHistoryRouter.get("/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const expensesHistory = await getExpensesInMonth(req.userId, month);
    if (expensesHistory && expensesHistory.length > 0) {
      res.status(200).json(expensesHistory);
    } else {
      res.status(404).send({ error: "No expenses found for this month" });
    }
  } catch (error) {
    console.error("Error fetching month's expenses:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

// Archive expenses made in a certain month
expensesHistoryRouter.post("/:month/archive", async (req, res) => {
  try {
    const { month } = req.params;
    const result = await archiveExpenses(req.userId, month);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error archiving expenses:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

expensesHistoryRouter.delete("/archived", async (req, res) => {
  try {
    const result = await deleteArchivedExpenses(req.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting archived expenses:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

// Delete all expense history
expensesHistoryRouter.delete("/", async (req, res) => {
  try {
    const result = await deleteAllExpenseHistory(req.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting all expense history:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// Delete expense history for a single month
expensesHistoryRouter.delete("/:month", async (req, res) => {
  try {
    const { month } = req.params;
    const result = await deleteExpenseHistoryForMonth(req.userId, month);
    res.status(200).json(result);
  } catch (error) {
    console.error(
      `Error deleting expense history for ${month}:`,
      error.message,
    );
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

export default expensesHistoryRouter;
