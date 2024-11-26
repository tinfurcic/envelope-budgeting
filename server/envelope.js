import { findEnvelopeIndexById } from "./utils/findEnvelopeIndexById.js";

//export let envelopes = [];
const fakeEnvelopes = [
  {
    id: "1",
    name: "first",
    budget: 10,
    currentAmount: 5,
  },
  {
    id: "2",
    name: "second",
    budget: 100,
    currentAmount: 50,
  },
  {
    id: "3",
    name: "third",
    budget: 200,
    currentAmount: 150,
  },
  {
    id: "4",
    name: "fourth",
    budget: 400,
    currentAmount: 240,
  },
  {
    id: "5",
    name: "fifth",
    budget: 1000,
    currentAmount: 800,
  },
  {
    id: "6",
    name: "sixth",
    budget: 2000,
    currentAmount: 500,
  },
  {
    id: "7",
    name: "seventh",
    budget: 3000,
    currentAmount: 1200,
  },
  {
    id: "8",
    name: "eighth",
    budget: 4000,
    currentAmount: 3200,
  },
  {
    id: "9",
    name: "ninth",
    budget: 5000,
    currentAmount: 3000,
  },
  {
    id: "10",
    name: "tenth",
    budget: 8000,
    currentAmount: 5400,
  },
];
export let envelopes = fakeEnvelopes;

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
