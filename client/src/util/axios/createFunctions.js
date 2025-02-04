import axiosInstance from "./axiosInstance";

export const createEnvelope = async (
  name,
  budget,
  currentAmount,
  description,
  color,
  setEnvelopes,
) => {
  try {
    const res = await axiosInstance.post("/envelopes", {
      name,
      budget,
      currentAmount,
      description,
      color,
    });
    setEnvelopes((prevEnvelopes) => [...prevEnvelopes, res.data]);
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
  setExpenses,
) => {
  try {
    const res = await axiosInstance.post("/expenses", {
      amount,
      date,
      sources,
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

export const createGoal = async (
  goalAmount,
  deadline,
  monthlyAmount,
  description,
  setGoals,
) => {
  try {
    const res = await axiosInstance.post("/goals", {
      goalAmount,
      deadline,
      monthlyAmount,
      description,
    });
    setGoals((prevGoals) => [...prevGoals, res.data]);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: error.message };
  }
};
