import axiosInstance from "./axiosInstance";

export const updateIncome = async (regularIncome, extraIncome) => {
  try {
    const res = await axiosInstance.patch("/income", {
      regularIncome,
      extraIncome,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating income:", error.message);
    return { success: false, error: error.message };
  }
};
