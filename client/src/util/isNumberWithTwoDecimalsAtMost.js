export const isNumberWithTwoDecimalsAtMost = (input) => {
  const tolerance = 1e-10;
  if (typeof input !== "number" || Number.isNaN(input)) {
    return false;
  }
  const shifted = input * 100;
  return Math.abs(Math.floor(shifted) - shifted) < tolerance;
};
