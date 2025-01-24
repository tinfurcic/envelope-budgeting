import axiosInstance from "./axiosInstance";

export const handleUpdate = async (id, name, budget, currentAmount) => {
  try {
    const res = await axiosInstance.patch(`/envelopes/${Number(id)}`, {
      name,
      budget,
      currentAmount,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating envelope:", error.message);
    return { success: false, error: error.message };
  }
};
