import axiosInstance from "./axiosInstance";

export const fetchEnvelopes = async () => {
  try {
    const res = await axiosInstance.get("/envelopes");
    return res.data;
  } catch (error) {
    console.error("Error fetching envelopes:", error.message);
    return null;
  }
};

export const fetchExpenses = async () => {
  try {
    const res = await axiosInstance.get("/expenses");
    return res.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    return null;
  }
};

export const fetchGoals = async () => {
  try {
    const res = await axiosInstance.get("/goals");
    return res.data;
  } catch (error) {
    console.error("Error fetching goals:", error.message);
    return null;
  }
};

export const fetchIncome = async () => {
  try {
    const res = await axiosInstance.get("/income");
    return res.data;
  } catch (error) {
    console.error("Error fetching income:", error.message);
    return null;
  }
};

export const fetchSavings = async () => {
  try {
    const res = await axiosInstance.get("/savings");
    return res.data;
  } catch (error) {
    console.error("Error fetching savings:", error.message);
    return null;
  }
};

export const fetchSettings = async () => {
  try {
    const res = await axiosInstance.get("/settings");
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    return null;
  }
};
