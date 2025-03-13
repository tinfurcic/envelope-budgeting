export const daysUntilNextMonth = () => {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const diffInMillis = nextMonth - today;
  const daysUntilNextMonth = Math.ceil(diffInMillis / (1000 * 60 * 60 * 24));
  return daysUntilNextMonth;
};
