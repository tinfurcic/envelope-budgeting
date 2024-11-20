import express from "express";
import { getTotalBudget, setTotalBudget } from "../budget.js";

export const budgetRouter = express.Router();

budgetRouter.get("/", (req, res, next) => {
  // get total budget
  const result = getTotalBudget();
  if (result !== undefined) {
    res.status(200).send({ totalBudget: result });
  } else {
    res.status(404).send();
  }
});

budgetRouter.post("/", (req, res, next) => {
  const newBudgetBody = req.body;
  if (Object.hasOwn(newBudgetBody, "amount")) {
    const budget = parseFloat(newBudgetBody.amount);
    console.log(
      "[budgetRouter] The budget is " +
        budget +
        ", which is of type " +
        typeof budget,
    );
    if (isNaN(budget)) {
      return res.status(400).json({ error: "Amount must be a valid number" });
    }
    try {
      setTotalBudget(budget);
      res.status(201).json({ amount: budget });
    } catch (error) {
      console.error("An error occurred in setTotalBudget():", error.message);
      res.status(500).json({ error: "Failed to set budget" });
    }
  } else {
    res.status(400).json({ error: "Amount is required" });
  }
});
