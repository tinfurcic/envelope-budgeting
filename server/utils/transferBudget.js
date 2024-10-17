import { envelopes } from "../database";
import { findEnvelopeIndexById } from "./findEnvelopeIndexById"; // if it's not found, nothing (undefined) is returned
import { updateEnvelope } from "../envelope";

export const transferBudget = (givingEnvelopeId, receivingEnvelopeId, amount) => {
    const givingEnvelopeIndex = findEnvelopeIndexById(givingEnvelopeId);
    const givingEnvelope = envelopes[givingEnvelopeIndex];
    const receivingEnvelopeIndex = findEnvelopeIndexById(receivingEnvelopeId);
    const receivingEnvelope = envelopes[receivingEnvelopeIndex];

    if (givingEnvelopeIndex !== undefined) { // If it wasn't found, givingEnvelopeIndex is undefined
        if (givingEnvelope.budget >= amount)  { // ah, this doesn't look optimal... make that check elsewhere
            updateEnvelope(givingEnvelopeId, null, givingEnvelope.budget - amount, null); // subtracting budget
            updateEnvelope(receivingEnvelopeId, null, receivingEnvelope.budget + amount, null); // adding budget
        } else {
            throw new Error(`You can transfer at most ${givingEnvelope.budget} dollars (or whatever) from ${givingEnvelope.name}!`);
        }
    }
    
}