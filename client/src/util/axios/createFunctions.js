import axiosInstance from "./axiosInstance";

export const createEnvelope = async (
  name,
  budget,
  currentAmount,
  description,
  color,
) => {
  try {
    const res = await axiosInstance.post("/envelopes", {
      name,
      budget,
      currentAmount,
      description,
      color,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating envelope:", error);
    return { success: false, error: error.message };
  }
};

export const createExpense = async (
  amount,
  date,
  sources,
  description,
  isLockedIn,
) => {
  try {
    const res = await axiosInstance.post("/expenses", {
      amount,
      date,
      sources,
      description,
      isLockedIn,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { success: false, error: error.message };
  }
};

export const createGoal = async (name, goalAmount, deadline, description) => {
  try {
    const res = await axiosInstance.post("/goals", {
      name,
      goalAmount,
      deadline,
      description,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: error.message };
  }
};

export const archiveExpenses = async (month) => {
  try {
    const res = await axiosInstance.post(
      `/expensesHistory/${month}/archive`,
      {},
    );
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { success: false, error: error.message };
  }
};
