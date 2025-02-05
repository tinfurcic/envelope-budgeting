import { updateEnvelope, updateSavings } from "./axios/updateFunctions";

export const payExpense = async (
  newExpenseAmount,
  newExpenseSources,
  envelopes,
  savings,
) => {

  let totalAmount = 0;
  for (const source of newExpenseSources) {
    totalAmount += Number(source.amount);
  }
  if (totalAmount !== Number(newExpenseAmount)) {
    console.log(newExpenseAmount)
    console.log(totalAmount);
    throw new Error("Amounts from sources don't add up to total expense!");
  }

  let newShortTermSavings = savings.shortTermSavings;
  let newLongTermSavings = savings.longTermSavings;
  const promises = [];

  for (let i = 0; i < newExpenseSources.length; i++) {
    const source = newExpenseSources[i];

    if (source.amount > source.available) {
      throw new Error(`Not enough funds in ${source.name}!`);
    } else {
      if (source.type === "shortTermSavings") {
        // Reduce the short-term savings amount
        newShortTermSavings -= source.amount;
      } else if (source.type === "longTermSavings") {
        // Reduce the long-term savings amount
        newLongTermSavings -= source.amount;
      } else {
        const envelope = envelopes.find((item) => item.id === source.id);
        if (envelope) {
          promises.push(updateEnvelope(
            envelope.id,
            envelope.name,
            envelope.budget,
            envelope.currentAmount - source.amount,
            envelope.description,
            envelope.color,
            envelope.order
          ));
        } else {
          console.warn(`Envelope with ID ${source.id} not found.`);
        }
      }
    }
  }

  // If any savings need updating, do so with a single request
  if (newShortTermSavings !== savings.shortTermSavings || newLongTermSavings !== savings.longTermSavings) {
    promises.push(updateSavings(newShortTermSavings, newLongTermSavings));
  }

  try {
    const results = await Promise.all(promises);

    // Check if all operations were successful
    const allSuccess = results.every(result => result.success);
    if (!allSuccess) {
      return { success: false, error: "One or more operations failed." };
    }

    return { success: true, data: results };
  } catch (error) {
    return { success: false, error: error.message };
  }
};