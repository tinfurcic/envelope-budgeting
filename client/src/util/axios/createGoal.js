import axiosInstance from "./axiosInstance";

export const createGoal = async (
  goalAmount,
  deadline,
  monthlyAmount,
  description,
) => {
  try {
    const res = await axiosInstance.post("/goals", {
      goalAmount,
      deadline,
      monthlyAmount,
      description,
    });
    return res.data;
  } catch (err) {
    console.error("Error creating goal:", err);
  }
};
