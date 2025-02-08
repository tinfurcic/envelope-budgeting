import axiosInstance from "./axiosInstance";

export const deleteEnvelope = async (id) => {
  try {
    await axiosInstance.delete(`/envelopes/${id}`);
  } catch (error) {
    console.error("Error deleting envelope:", error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

export const deleteGoal = async (id) => {
  try {
    await axiosInstance.delete(`/goals/${id}`);
  } catch (err) {
    console.error("Error deleting goal:", err);
    throw error;
  }
};

export async function deleteArchivedExpenses(month) {
  try {
    const response = await axiosInstance.post(`/expenses/archived/${month}`);
    return response.data;
  } catch (error) {
    console.error(`Error archiving expenses for ${month}:`, error.message);
    throw error;
  }
}
