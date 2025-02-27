export const dateDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const diffInMs = d2 - d1;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays;
};
