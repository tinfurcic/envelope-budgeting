import axiosInstance from "./axiosInstance";

export const updateGoal = async (
  id,
  goalAmount,
  deadline,
  monthlyAmount,
  description,
) => {
  try {
    const res = await axiosInstance.patch(`/goals/${id}`, {
      goalAmount,
      deadline,
      monthlyAmount,
      description,
    });
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error updating goal:", error.message);
    return { success: false, error: error.message };
  }
};
