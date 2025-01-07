import express from "express";
import {
  getAllEnvelopes,
  getEnvelopeById,
  createEnvelope,
  updateEnvelope,
  deleteEnvelope,
} from "../envelope.js";

export const envelopesRouter = express.Router();

// Middleware to extract userId from the request (assuming authentication adds it)
envelopesRouter.use((req, res, next) => {
  const userId = req.user?.uid; // Adjust this based on how authentication is implemented
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: Missing user ID" });
  }
  req.userId = userId;
  next();
});

// Endpoint to get all envelopes
envelopesRouter.get("/", async (req, res) => {
  try {
    const envelopes = await getAllEnvelopes(req.userId);
    res.status(200).json(envelopes);
  } catch (error) {
    console.error("Error fetching envelopes:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to get an envelope by ID
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
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to create a new envelope
envelopesRouter.post("/", async (req, res) => {
  const { name, budget, currentAmount } = req.body;
  if (!name || isNaN(budget) || isNaN(currentAmount)) {
    return res.status(400).send({ error: "Invalid envelope data" });
  }

  try {
    const newEnvelope = await createEnvelope(req.userId, name, budget, currentAmount);
    res.status(201).json(newEnvelope);
  } catch (error) {
    console.error("Error creating envelope:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to update an envelope by ID
envelopesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, budget, currentAmount } = req.body;

  try {
    const updatedEnvelope = await updateEnvelope(req.userId, id, name, budget, currentAmount);
    res.status(200).json(updatedEnvelope);
  } catch (error) {
    console.error("Error updating envelope:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Endpoint to delete an envelope by ID
envelopesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await deleteEnvelope(req.userId, id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting envelope:", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default envelopesRouter;
