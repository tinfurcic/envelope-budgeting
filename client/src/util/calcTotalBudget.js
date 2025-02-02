export const calcTotalBudget = (envelopes) => {
  if (envelopes === null) return null;
  let total = 0;
  for (const envelope of envelopes) {
    total += envelope.budget;
  }
  return total;
};
