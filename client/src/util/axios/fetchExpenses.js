import axiosInstance from "./axiosInstance";

export const fetchExpenses = async () => {
  try {
    const res = await axiosInstance.get("/expenses");
    return res.data;
  } catch (error) {
    console.error("Error fetching expenses:", error.message);
    return null;
  }
};
