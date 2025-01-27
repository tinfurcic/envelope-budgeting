import axiosInstance from "./axiosInstance";

export const deleteEnvelope = async (id, setEnvelopes) => {
  try {
    await axiosInstance.delete(`/envelopes/${id}`);
    setEnvelopes((prevEnvelopes) =>
      prevEnvelopes.filter((envelope) => envelope.id !== id),
    );
  } catch (error) {
    console.error("Error deleting envelope:", error);
  }
};

export const deleteExpense = async (id, setExpenses) => {
  try {
    await axiosInstance.delete(`/expenses/${id}`);
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id),
    );
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
