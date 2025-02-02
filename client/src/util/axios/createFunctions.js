import { isNumberWithTwoDecimalsAtMost } from "../isNumberWithTwoDecimalsAtMost";
import axiosInstance from "./axiosInstance";

export const createEnvelope = async (
  newEnvelopeName,
  newEnvelopeBudget,
  newEnvelopeCurrentAmount,
  newEnvelopeDescription,
  newEnvelopeColor,
  setEnvelopes,
) => {
  if (
    typeof newEnvelopeName === "string" &&
    isNumberWithTwoDecimalsAtMost(newEnvelopeBudget) &&
    isNumberWithTwoDecimalsAtMost(newEnvelopeCurrentAmount) &&
    Number(newEnvelopeCurrentAmount) <= Number(newEnvelopeBudget)
  ) {
    try {
      const res = await axiosInstance.post("/envelopes", {
        name: newEnvelopeName,
        budget: newEnvelopeBudget,
        currentAmount: newEnvelopeCurrentAmount,
        description: newEnvelopeDescription,
        color: newEnvelopeColor,
      });
      setEnvelopes((prevEnvelopes) => [...prevEnvelopes, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  } else {
    return { success: false, error: "Invalid input value(s)." };
  }
};

export const createExpense = async (
  amount,
  date,
  source,
  description,
  isLockedIn,
  setExpenses,
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
