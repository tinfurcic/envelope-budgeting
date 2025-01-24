import axiosInstance from "./axiosInstance";

export const createGoal = async (
  goalAmount,
  deadline,
  monthlyAmount,
  description,
  setGoals,
) => {
  try {
    const res = await axiosInstance.post("/goals", {
      goalAmount,
      deadline,
      monthlyAmount,
      description,
    });
    setGoals((prevGoals) => [...prevGoals, res.data]);
    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: error.message };
  }
};
