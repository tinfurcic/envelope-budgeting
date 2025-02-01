import {
  fetchEnvelopes,
  fetchIncome,
  fetchGoals,
  fetchSettings,
  fetchSavings,
  fetchExpenses,
} from "./axios/fetchFunctions";

export const fetchAllData = async () => {
  try {
    const [envelopeData, expenseData, goalData, income, savings, settings] =
      await Promise.allSettled([
        fetchEnvelopes(),
        fetchExpenses(),
        fetchGoals(),
        fetchIncome(),
        fetchSavings(),
        fetchSettings(),
      ]);

    return {
      envelopes:
        envelopeData.status === "fulfilled" ? envelopeData.value.envelopes : [],
      expenses:
        expenseData.status === "fulfilled" ? expenseData.value.expenses : [],
      goals: goalData.status === "fulfilled" ? goalData.value.goals : [],

      income: income.status === "fulfilled" ? income.value : null,
      savings: savings.status === "fulfilled" ? savings.value : null,
      settings: settings.status === "fulfilled" ? settings.value : null,

      nextEnvelopeId:
        envelopeData.status === "fulfilled"
          ? envelopeData.value.metadata.extEnvelopeId
          : null,
      nextExpenseId:
        expenseData.status === "fulfilled"
          ? expenseData.value.metadata.nextExpenseId
          : null,
      nextGoalId:
        goalData.status === "fulfilled"
          ? goalData.value.metadata.nextGoalId
          : null,
    };
  } catch (error) {
    console.error("Error fetching all data:", error);
    return {
      envelopes: [],
      expenses: [],
      goals: [],
      income: null,
      savings: null,
      settings: null,
      nextEnvelopeId: null,
      nextGoalId: null,
      nextExpenseId: null,
    };
  }
};
