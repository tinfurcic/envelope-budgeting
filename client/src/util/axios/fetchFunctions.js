import axiosInstance from "./axiosInstance";

export const fetchEnvelopes = async () => {
  try {
    const res = await axiosInstance.get("/envelopes");
    return res.data;
  } catch (error) {
    console.error("Error fetching envelopes:", error.message);
    throw error;
  }
};

export const fetchExpenses = async () => {
  try {
    const res = await axiosInstance.get("/expenses");
    return res.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    throw error;
  }
};

export const fetchGoals = async () => {
  try {
    const res = await axiosInstance.get("/goals");
    return res.data;
  } catch (error) {
    console.error("Error fetching goals:", error.message);
    throw error;
  }
};

export const fetchIncome = async () => {
  try {
    const res = await axiosInstance.get("/income");
    return res.data;
  } catch (error) {
    console.error("Error fetching income:", error.message);
    throw error;
  }
};

export const fetchSavings = async () => {
  try {
    const res = await axiosInstance.get("/savings");
    return res.data;
  } catch (error) {
    console.error("Error fetching savings:", error.message);
    throw error;
  }
};

export const fetchSettings = async () => {
  try {
    const res = await axiosInstance.get("/settings");
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    throw error;
  }
};

export async function getAllExpensesHistory() {
  try {
    const res = await axiosInstance.get("/expensesHistory");
    return res.data;
  } catch (error) {
    console.error("Error fetching all expense history:", error.message);
    throw error;
  }
}

export async function getExpensesInMonth(month) {
  try {
    const res = await axiosInstance.get(`/expensesHistory/${month}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching expenses for ${month}:`, error.message);
    throw error;
  }
}
