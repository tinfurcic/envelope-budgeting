import axiosInstance from "./axiosInstance";

export const updateEnvelope = async (
  id,
  name,
  budget,
  currentAmount,
  description,
  color,
  order,
) => {
  try {
    const res = await axiosInstance.patch(`/envelopes/${Number(id)}`, {
      name,
      budget,
      currentAmount,
      description,
      color,
      order,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating envelope:", error.message);
    return { success: false, error: error.message };
  }
};

export const batchUpdateEnvelopeOrders = async (envelopes) => {
  try {
    const res = await axiosInstance.patch("/envelopes", { envelopes });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating envelope:", error.message);
    return { success: false, error: error.message };
  }
};

export const batchDeleteAndReorderEnvelopes = async (
  deletedEnvelopeIds,
  updatedEnvelopeIds,
) => {
  if (
    !Array.isArray(deletedEnvelopeIds) ||
    !Array.isArray(updatedEnvelopeIds)
  ) {
    throw new Error("Invalid input: Both parameters must be arrays.");
  }
  try {
    const res = await axiosInstance.patch("/envelopes/batch-delete-reorder", {
      deletedEnvelopeIds,
      updatedEnvelopeIds,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error(
      "Error in batch delete and reorder request:",
      error.response?.data || error.message,
    );
    return { success: false, error: error.message };
  }
};

export const updateExpense = async (
  id,
  amount,
  date,
  sources,
  description,
  isLockedIn,
) => {
  try {
    const res = await axiosInstance.patch(`/expenses/${Number(id)}`, {
      amount,
      date,
      sources,
      description,
      isLockedIn,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating expense:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateGoal = async (
  id,
  name,
  goalAmount,
  deadline,
  accumulated,
  description,
) => {
  try {
    const res = await axiosInstance.patch(`/goals/${id}`, {
      name,
      goalAmount,
      deadline,
      accumulated,
      description,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating goal:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateIncome = async (regularIncome, extraIncome) => {
  try {
    const res = await axiosInstance.patch("/income", {
      regularIncome,
      extraIncome,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating income:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateSavings = async (shortTermSavings, longTermSavings) => {
  try {
    const res = await axiosInstance.patch("/savings", {
      shortTermSavings,
      longTermSavings,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating savings:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateSettings = async (currencyType, enableDebt) => {
  try {
    const res = await axiosInstance.patch("/settings", {
      currencyType,
      enableDebt,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating settings:", error.message);
    return { success: false, error: error.message };
  }
};
