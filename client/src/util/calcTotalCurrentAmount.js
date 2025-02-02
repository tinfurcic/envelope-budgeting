export const calcTotalCurrentAmount = (envelopes) => {
  if (envelopes === null) return null;
  let total = 0;
  for (const envelope of envelopes) {
    total += envelope.currentAmount;
  }
  return total;
};
