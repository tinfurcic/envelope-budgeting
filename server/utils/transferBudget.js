import { envelopes, updateEnvelope } from "../envelope.js";
import { findEnvelopeIndexById } from "./findEnvelopeIndexById.js"; // if it's not found, nothing (undefined) is returned

export const transferBudget = (givingEnvelopeId, receivingEnvelopeId, amount) => {
    const givingEnvelopeIndex = findEnvelopeIndexById(givingEnvelopeId);
    const receivingEnvelopeIndex = findEnvelopeIndexById(receivingEnvelopeId);
    try {
        const givingEnvelope = envelopes[givingEnvelopeIndex];
        const receivingEnvelope = envelopes[receivingEnvelopeIndex];
        if (Number(givingEnvelope.budget) >= Number(amount))  {
            updateEnvelope(givingEnvelopeId, null, `${Number(givingEnvelope.budget) - Number(amount)}`, null); // subtracting budget
            updateEnvelope(receivingEnvelopeId, null, `${Number(receivingEnvelope.budget) + Number(amount)}`, null); // adding budget
            return true;
        } else {
            throw new Error(`You can transfer at most ${givingEnvelope.budget} dollars (or whatever) from ${givingEnvelope.name}!`);
        }
    } catch (error) {
        console.error("An error occurred in findEnvelopeIndexById():", error.message);
        return false;
    }        
}