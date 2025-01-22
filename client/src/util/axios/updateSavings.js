import axiosInstance from "./axiosInstance";

export const updateSavings = async (shortTermSavings, longTermSavings) => {
  try {
    const res = await axiosInstance.patch("/savings", {
      shortTermSavings,
      longTermSavings,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating savings:", error.message);
    return { success: false, error: error.message };
  }
};
