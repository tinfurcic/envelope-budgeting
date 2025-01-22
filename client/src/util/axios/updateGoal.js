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
    return res.data;
  } catch (err) {
    console.error("Error updating goal:", err);
  }
};
