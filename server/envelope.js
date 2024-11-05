import { findEnvelopeIndexById } from "./utils/findEnvelopeIndexById.js";

export let envelopes = [];

let envelopeId = 1;

export let isValidEnvelopeId = (envelopeId) => {
  const foundEnvelope = envelopes.find(
    (envelope) => envelope.id === envelopeId,
  );
  return foundEnvelope; // truthy if found, undefined (falsy) if not found
};

export const getAllEnvelopes = () => {
  return envelopes;
};

export const getEnvelopeById = (envelopeId) => {
  // try... catch should probably be used here
  try {
    const envelopeIndex = findEnvelopeIndexById(envelopeId);
    if (envelopeIndex !== undefined) {
      const envelope = envelopes[envelopeIndex];
      return envelope;
    }
  } catch (error) {
    console.error(
      "An error occurred in findEnvelopeIndexById():",
      error.message,
    );
  }
};

export const createEnvelope = (name, budget, currentAmount) => {
  if (name !== "" && Number(budget) !== 0) {
    const envelope = {
      id: `${envelopeId++}`,
      name: `${name}`,
      budget: `${budget}`,
      currentAmount: `${currentAmount}`,
    };
    envelopes.push(envelope);
    return envelope;
  } else {
    throw new Error("Missing name or budget!");
  }
};

export const updateEnvelope = (
  envelopeId,
  newName,
  newBudget,
  newCurrentAmount,
) => {
  // hm, why not just (envelopeId, envelope)
  // this function will handle all kinds of updates. All provided parameters will be changed.
  // If a parameter is not provided, old values will be kept.
  try {
    const envelopeIndex = findEnvelopeIndexById(envelopeId);
    const envelope = envelopes[envelopeIndex];

    envelope.name = newName ?? envelope.name;
    envelope.budget = newBudget ?? envelope.budget;
    envelope.currentAmount = newCurrentAmount ?? envelope.currentAmount;

    envelopes[envelopeIndex] = envelope;
  } catch (error) {
    console.error(
      "An error occurred in findEnvelopeIndexById():",
      error.message,
    );
  }
};

export const deleteEnvelope = (envelopeId) => {
  envelopes = envelopes.filter((element) => element.id !== envelopeId);
};
