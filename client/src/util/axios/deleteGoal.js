import axiosInstance from "./axiosInstance";

export const deleteGoal = async (id) => {
  try {
    await axiosInstance.delete(`/goals/${id}`);
  } catch (err) {
    console.error("Error deleting goal:", err);
  }
};
