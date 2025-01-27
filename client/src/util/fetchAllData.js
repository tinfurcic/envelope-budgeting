import {
  fetchEnvelopes,
  fetchIncome,
  fetchGoals,
  fetchSettings,
  fetchSavings,
  fetchExpenses,
} from "./axios/fetchFunctions";

export const fetchAllData = async () => {
  const [envelopes, goals, expenses, income, savings, settings] =
    await Promise.all([
      fetchEnvelopes(),
      fetchGoals(),
      fetchExpenses(),
      fetchIncome(),
      fetchSavings(),
      fetchSettings(),
    ]);

  return { envelopes, goals, expenses, income, savings, settings };
};
