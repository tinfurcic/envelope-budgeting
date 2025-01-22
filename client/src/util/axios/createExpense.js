import axiosInstance from "./axiosInstance";

export const createExpense = async (
  amount,
  date,
  source,
  description,
  isLockedIn,
  setExpenses
) => {
  try {
    const res = await axiosInstance.post("/expenses", {
      amount,
      date,
      source,
      description,
      isLockedIn,
    });
    setExpenses((prevExpenses) => [...prevExpenses, res.data]);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating expense:", error);
    return { success: false, error: error.message };
  }
};
