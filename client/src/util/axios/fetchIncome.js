import axiosInstance from "./axiosInstance";

export const fetchIncome = async () => {
  try {
    const res = await axiosInstance.get("/income");
    return res.data;
  } catch (error) {
    console.error("Error fetching income:", error.message);
    return null;
  }
};
