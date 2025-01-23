import axiosInstance from "./axiosInstance";

export const updateSettings = async (currencyType, enableDebt) => {
  try {
    const res = await axiosInstance.patch("/settings", {
      currencyType,
      enableDebt,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating settings:", error.message);
    return { success: false, error: error.message };
  }
};
