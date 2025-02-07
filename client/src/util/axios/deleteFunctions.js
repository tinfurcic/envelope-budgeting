import axiosInstance from "./axiosInstance";

export const deleteEnvelope = async (id) => {
  try {
    await axiosInstance.delete(`/envelopes/${id}`);
  } catch (error) {
    console.error("Error deleting envelope:", error);
  }
};

export const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};

export const deleteGoal = async (id) => {
  try {
    await axiosInstance.delete(`/goals/${id}`);
  } catch (err) {
    console.error("Error deleting goal:", err);
  }
};
