export const calcUnassignedBudget = (envelopes, totalBudget) => {
  if (envelopes === null || totalBudget === null) return null;
  let total = 0;
  for (const envelope of envelopes) {
    total += envelope.budget;
  }
  return totalBudget - total;
};
