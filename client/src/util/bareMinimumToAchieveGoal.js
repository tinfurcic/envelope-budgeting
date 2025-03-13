// This function counts the number of first days in the month
// (which should be equal to the number of salaries received in the meantime)
export const bareMinimumToAchieveGoal = (amount, deadline) => {
  const start = new Date();
  const end = new Date(deadline);
  // Set the day to the 1st of the month
  start.setDate(1);
  end.setDate(1);
  let count = 0;
  while (start <= end) {
    count++;
    start.setMonth(start.getMonth() + 1);
  }
  return Math.ceil((amount / count) * 100) / 100;
};
