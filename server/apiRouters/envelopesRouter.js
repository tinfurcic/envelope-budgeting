import express from 'express'; 
import { envelopes, isValidEnvelopeId, getAllEnvelopes, getEnvelopeById, createEnvelope, updateEnvelope, deleteEnvelope } from '../envelope.js'
import { transferBudget } from '../utils/transferBudget.js'

export const envelopesRouter = express.Router();

envelopesRouter.get('/', (req, res, next) => { // get all envelopes
    const results = getAllEnvelopes();
    if (results) {
        res.status(200).send(envelopes);
    } else {
        res.status(404).send(); // not sure about status code.
    }
});

envelopesRouter.post('/', (req, res, next) => { // create a new envelope
    const newEnvelope = req.body;
    if (Object.hasOwn(newEnvelope, 'name') && Object.hasOwn(newEnvelope, 'budget') && Object.hasOwn(newEnvelope, 'currentAmount')) {
        try {
            createEnvelope(newEnvelope.name, newEnvelope.budget, newEnvelope.currentAmount);
            res.status(201).send(newEnvelope);
        } catch (error) {
            console.error("An error occurred in createEnvelope():", error.message);
        }
    } else {
        res.status(400).send();
    }
});

envelopesRouter.get('/:envelopeId', (req, res, next) => { // get a specific envelope
    // try... catch should probably be used here
    const envelopeId = req.params.envelopeId;
    const envelope = getEnvelopeById(envelopeId);
    if (envelope) { 
        res.send(envelope);
    } else {
        res.status(404).send();
    }
});

envelopesRouter.post('/:envelopeId', (req, res, next) => { // change budget, name, or current amount
    // The data is sent through request body (JSON).
    // Provided key-value pairs will be updated.
    // If a key-value pair is missing, it will remain unchanged.
    const envelopeId = req.params.envelopeId;
    const sentEnvelope = req.body; // hmmmmm
    const envelope = getEnvelopeById(envelopeId);
    if (envelope) {
        updateEnvelope(envelopeId, sentEnvelope.name, sentEnvelope.budget, sentEnvelope.currentAmount);
        res.status(200).send(getEnvelopeById(envelopeId));
    } else {
        res.status(404).send();
    }
});

envelopesRouter.post('/transfer/:from/:to/:amount', (req, res, next) => { // transfer budget from one envelope to another
    const givingEnvelopeId = req.params.from;
    const receivingEnvelopeId = req.params.to;
    const transferAmount = req.params.amount;

    try {
        const isSuccessful = transferBudget(givingEnvelopeId, receivingEnvelopeId, transferAmount);
        if (isSuccessful) {
            res.status(200).send();
        } else {
            res.status(400).send("Transfer failed");
        }
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

envelopesRouter.delete('/:envelopeId', (req, res, next) => { // delete specific envelope
    const envelopeId = req.params.envelopeId;
    if (isValidEnvelopeId(envelopeId)) {
        deleteEnvelope(envelopeId);
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});