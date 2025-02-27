import axiosInstance from "./axiosInstance";

export const deleteEnvelope = async (id) => {
  try {
    await axiosInstance.delete(`/envelopes/${id}`);
    return { success: true, message: "Envelope successfully deleted." };
  } catch (error) {
    console.error("Error deleting envelope:", error);
    return { success: false, error: error.message };
  }
};

export const deleteExpense = async (id) => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
    return { success: true, message: "Expense successfully deleted." };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { success: false, error: error.message };
  }
};

export const deleteGoal = async (id, isAbandoned) => {
  try {
    await axiosInstance.delete(`/goals/${id}?abandoned=${isAbandoned}`);
    return { success: true, message: "Goal successfully deleted." };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: error.message };
  }
};

export async function deleteArchivedExpenses(month) {
  try {
    const response = await axiosInstance.post(`/expenses/archived/${month}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error archiving expenses for ${month}:`, error.message);
    return { success: false, message: error.message };
  }
}
