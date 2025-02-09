import express from "express";
import { getSavings, updateSavingsType, updateSavings } from "../savings.js";

export const savingsRouter = express.Router();

savingsRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

// GET all savings
savingsRouter.get("/", async (req, res) => {
  try {
    const savings = await getSavings(req.userId);
    res.status(200).json(savings);
  } catch (error) {
    console.error("Error fetching savings:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// PATCH to update both savings types in a single request
savingsRouter.patch("/", async (req, res) => {
  const { shortTermSavings, longTermSavings } = req.body;

  // Ensure both fields are provided
  if (shortTermSavings === undefined || longTermSavings === undefined) {
    return res.status(400).json({
      error: "'shortTermSavings' and 'longTermSavings' must be provided.",
    });
  }

  // Ensure both fields are numbers
  if (isNaN(shortTermSavings) || isNaN(longTermSavings)) {
    return res.status(400).json({
      error:
        "Invalid values. 'shortTermSavings' and 'longTermSavings' must be numbers.",
    });
  }

  try {
    // Update both savings types simultaneously
    const updatedSavings = await updateSavings(
      req.userId,
      shortTermSavings,
      longTermSavings,
    );
    res.status(200).json(updatedSavings);
  } catch (error) {
    console.error("Error updating savings:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

// PATCH to update a specific savings type
// Isn't used on the front end
savingsRouter.patch("/:savingsType", async (req, res) => {
  const { savingsType } = req.params;
  const { currentAmount } = req.body;

  const allowedSavingsTypes = ["shortTermSavings", "longTermSavings"];
  if (!allowedSavingsTypes.includes(savingsType)) {
    return res.status(400).json({ error: "Invalid savingsType." });
  }

  if (isNaN(currentAmount)) {
    return res.status(400).json({ error: "Invalid value. Must be a number." });
  }

  try {
    const updatedSavings = await updateSavingsType(
      req.userId,
      savingsType,
      currentAmount,
    );
    res.status(200).json(updatedSavings);
  } catch (error) {
    console.error("Error updating savings:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

export default savingsRouter;
