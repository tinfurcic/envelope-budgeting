export const calcUnassignedBudget = (envelopes, totalBudget) => {
  let total = 0;
  for (const envelope of envelopes) {
    total += envelope.budget;
  }
  return totalBudget - total;
};
