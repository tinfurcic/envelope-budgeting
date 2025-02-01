import { updateEnvelope, updateSavings } from "./axios/updateFunctions";
import { findEnvelopeIndexById } from "./findEnvelopeIndexById";

// edit this so that it interacts with user's settings and/or choices
// ideally, the function first checks whether it can complete the process on its own, using settings rules
// e.g. the setting is "If an envelope doesn't have enough money, always try co-financing an expense from shortTermSavings"
// if it determines it can't, then further input from the user is required.

export const payExpense = async (
  newExpenseAmount,
  newExpenseSource,
  envelopes,
  savings,
) => {
  try {
    // Savings-based logic
    if (newExpenseSource === "savings") {
      if (savings.shortTermSavings >= Number(newExpenseAmount)) {
        const result = await updateSavings(
          savings.shortTermSavings - newExpenseAmount,
          savings.longTermSavings,
        );
        if (!result.success) {
          return { success: false, error: result.error };
        }
        return { success: true, data: result.data };
      } else if (
        savings.shortTermSavings + savings.longTermSavings >=
        Number(newExpenseAmount)
      ) {
        const difference = Number(newExpenseAmount) - savings.shortTermSavings;
        const result = await updateSavings(
          0,
          savings.longTermSavings - difference,
        );
        if (!result.success) {
          return { success: false, error: result.error };
        }
        return { success: true, data: result.data };
      }
    }

    // Envelope-based logic
    const envelopeIndex = findEnvelopeIndexById(envelopes, newExpenseSource);
    const envelope = envelopes[envelopeIndex];

    if (envelope.currentAmount >= Number(newExpenseAmount)) {
      const result = await updateEnvelope(
        newExpenseSource,
        envelope.name,
        envelope.budget,
        envelope.currentAmount - Number(newExpenseAmount),
      );
      if (!result.success) {
        return { success: false, error: result.error };
      }
      return { success: true, data: result.data };
    } else if (
      envelope.currentAmount + savings.shortTermSavings >=
      Number(newExpenseAmount)
    ) {
      const difference = Number(newExpenseAmount) - envelope.currentAmount;
      const [envelopeUpdateResult, savingsUpdateResult] = await Promise.all([
        updateEnvelope(newExpenseSource, envelope.name, envelope.budget, 0),
        updateSavings(
          savings.shortTermSavings - difference,
          savings.longTermSavings,
        ),
      ]);

      if (!envelopeUpdateResult.success) {
        return { success: false, error: envelopeUpdateResult.error };
      }
      if (!savingsUpdateResult.success) {
        return { success: false, error: savingsUpdateResult.error };
      }

      return {
        success: true,
        envelope: envelopeUpdateResult.data,
        savings: savingsUpdateResult.data,
      };
    } else if (
      envelope.currentAmount +
        savings.shortTermSavings +
        savings.longTermSavings >=
      Number(newExpenseAmount)
    ) {
      const difference =
        Number(newExpenseAmount) -
        envelope.currentAmount -
        savings.shortTermSavings;
      const [envelopeUpdateResult, savingsUpdateResult] = await Promise.all([
        updateEnvelope(newExpenseSource, envelope.name, envelope.budget, 0),
        updateSavings(0, savings.longTermSavings - difference),
      ]);

      if (!envelopeUpdateResult.success) {
        return { success: false, error: envelopeUpdateResult.error };
      }
      if (!savingsUpdateResult.success) {
        return { success: false, error: savingsUpdateResult.error };
      }

      return {
        success: true,
        envelope: envelopeUpdateResult.data,
        savings: savingsUpdateResult.data,
      };
    } else {
      return { success: false, error: "Not enough funds!" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};
