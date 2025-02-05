


import { updateEnvelope, updateSavings } from "./axios/updateFunctions";

// Helper function to update short term savings
const updateShortTermSavings = async (newShortTermSavings, longTermSavings) => {
  return await updateSavings(newShortTermSavings, longTermSavings);
};

// Helper function to update long term savings
const updateLongTermSavings = async (shortTermSavings, newLongTermSavings) => {
  return await updateSavings(shortTermSavings, newLongTermSavings);
};

// Helper function to update an envelope
const updateSourceEnvelope = async (source, sourceAmounts) => {
  const id = source.id;
  const newAmount = source.currentAmount - parseFloat(sourceAmounts[id]);
  return await updateEnvelope(
    source.id,
    source.name,
    source.budget,
    newAmount,
    source.description,
    source.color,
    source.order
  );
};

// Main function to pay expense
export const oldPayExpense = async (
  newExpenseAmount,
  newExpenseSources,
  sourceAmounts,
  envelopes,
  savings,
) => {
  console.log(newExpenseAmount);
  console.log(newExpenseSources);
  console.log(sourceAmounts);
  console.log(envelopes);
  console.log(savings);

  if (newExpenseSources.length !== Object.keys(sourceAmounts).length) {
    throw new Error("Sources and amounts not coordinated!!");
  }

  const promises = [];
  let newShortTermSavings = savings.shortTermSavings;

  for (let i = 0; i < newExpenseSources.length; i++) {
    const source = newExpenseSources[i];

    // Handle short-term savings
    if (source.shortTermSavings) {
      const shortTermAmount = parseFloat(sourceAmounts[-1]);
      if (shortTermAmount > source.shortTermSavings) {
        throw new Error("Can't pay expense from Short term savings!");
      }
      newShortTermSavings = source.shortTermSavings - shortTermAmount;
      promises.push(updateShortTermSavings(newShortTermSavings, savings.longTermSavings));
    }
    // Handle long-term savings
    else if (source.longTermSavings) {
      const longTermAmount = parseFloat(sourceAmounts[-2]);
      if (longTermAmount > source.longTermSavings) {
        throw new Error("Can't pay expense from Long term savings!");
      }
      promises.push(updateLongTermSavings(newShortTermSavings, source.longTermSavings - longTermAmount));
    }
    // Handle envelopes
    else {
      promises.push(updateSourceEnvelope(source, sourceAmounts));
    }
  }

  // Wait for all promises to complete and handle the result
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
