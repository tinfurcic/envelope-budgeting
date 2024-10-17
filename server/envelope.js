import { envelopes } from "./database";
import { findEnvelopeIndexById } from "./utils/findEnvelopeIndexById";

let envelopeId = 1;

export const getAllEnvelopes = () => {
    return envelopes;
}

export const getEnvelopeById = (envelopeId) => {
    const envelopeIndex = findEnvelopeIndexById(envelopeId);
    if (envelopeIndex !== undefined) {
        const envelope = envelopes[envelopeIndex];
        return envelope;
    }
}

export const createEnvelope = (name, budget, currentAmount) => {
    if (name !== "" && Number(budget) !== 0) {
        const envelope = {
            id: `${envelopeId++}`,
            name: `${name}`,
            budget: `${budget}`,
            currentAmount: `${currentAmount}`
        };
        envelopes.push(envelope);
    } else {
        throw new Error ("Missing name or budget!"); // this can probably be better.
    }
}

export const updateEnvelope = (envelopeId, newName, newBudget, newCurrentAmount) => {
    // this function will handle all kinds of updates. All provided parameters will be changed.
        // If a parameter is not provided, old values will be kept.
    const envelopeIndex = findEnvelopeIndexById(envelopeId);
    const envelope = envelopes[envelopeIndex];

    envelope.name = newName || envelope.name;
    envelope.budget = newBudget || envelope.budget;
    envelope.currentAmount = newCurrentAmount || envelope.currentAmount;

    envelopes[envelopeIndex] = envelope;
}

export const deleteEnvelope = (envelopeId) => {
    envelopes = envelopes.filter((element) => element.id !== envelopeId);
}
