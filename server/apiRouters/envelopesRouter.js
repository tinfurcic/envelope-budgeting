import express from "express";
import {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  updateEnvelope,
  batchUpdateEnvelopeOrders,
  batchDeleteEnvelopes,
  deleteEnvelope,
} from "../envelope.js";

export const envelopesRouter = express.Router();

envelopesRouter.use((req, res, next) => {
  const userId = req.user?.uid;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

envelopesRouter.get("/", async (req, res) => {
  try {
    const envelopes = await getAllEnvelopes(req.userId);
    res.status(200).json(envelopes);
  } catch (error) {
    console.error("Error fetching envelopes:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

envelopesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const envelope = await getEnvelopeById(req.userId, id);
    if (envelope) {
      res.status(200).json(envelope);
    } else {
      res.status(404).send({ error: "Envelope not found" });
    }
  } catch (error) {
    console.error("Error fetching envelope by ID:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

envelopesRouter.post("/", async (req, res) => {
  const { name, budget, currentAmount, description, color } = req.body;
  if (!name || isNaN(budget) || isNaN(currentAmount)) {
    // You might want to make all properties mandatory, and just pass default/insignificant values if they don't matter
    return res.status(400).send({ error: "Invalid envelope data" });
  }

  try {
    const newEnvelope = await createEnvelope(
      req.userId,
      name,
      budget,
      currentAmount,
      description,
      color,
    );
    res.status(201).json(newEnvelope);
  } catch (error) {
    console.error("Error creating envelope:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

envelopesRouter.patch("/delete", async (req, res) => {
  const { deletedEnvelopeIds } = req.body;

  // Validate request body
  if (!Array.isArray(deletedEnvelopeIds) || deletedEnvelopeIds.length === 0) {
    return res.status(400).json({ error: "Invalid input: Must provide an array of envelope IDs to delete." });
  }

  for (let i = 0; i < deletedEnvelopeIds.length; i++) {
    if (!Number.isInteger(deletedEnvelopeIds[i])) {
      return res.status(400).json({ error: `Invalid ID at index ${i}: Must be an integer.` });
    }
  }

  try {
    await batchDeleteEnvelopes(req.userId, deletedEnvelopeIds);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting envelopes:", error.message);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

envelopesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, budget, currentAmount, description, color, order } = req.body;

  try {
    const updatedEnvelope = await updateEnvelope(
      req.userId,
      id,
      name,
      budget,
      currentAmount,
      description,
      color,
      order,
    );
    res.status(200).json(updatedEnvelope);
  } catch (error) {
    console.error("Error updating envelope:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

envelopesRouter.patch("/", async (req, res) => {
  const { updatedEnvelopes } = req.body;

  if (!Array.isArray(updatedEnvelopes) || updatedEnvelopes.length === 0) {
    return res.status(400).send({ error: "Invalid input: Must provide an array of envelopes to update." });
  }

  // Validate each envelope object (only ID and newOrder are relevant)
  for (const envelope of updatedEnvelopes) {
    if (
      typeof envelope !== "object" ||
      envelope === null ||
      !Number.isInteger(envelope.id) ||
      !Number.isInteger(envelope.newOrder) // Only allow integer values for newOrder
    ) {
      return res.status(400).send({ error: "Invalid envelope data format." });
    }
  }

  try {
    await batchUpdateEnvelopeOrders(req.userId, updatedEnvelopes);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in batch envelope order update:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

envelopesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteEnvelope(req.userId, id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting envelope:", error.message);
    res.status(500).send({ error: `Internal server error: ${error.message}` });
  }
});

export default envelopesRouter;
