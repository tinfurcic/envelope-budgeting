export let totalBudget = 2100;

export const getTotalBudget = () => {
  return totalBudget;
};

export const setTotalBudget = (amount) => {
  if (typeof amount === "number") {
    totalBudget = amount;
  } else {
    throw new Error("The budget must be a number!");
  }
};
