import axiosInstance from "./axiosInstance";

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
