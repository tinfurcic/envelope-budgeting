import axiosInstance from "./axiosInstance";

export const fetchGoals = async () => {
  try {
    const res = await axiosInstance.get("/goals");
    return res.data;
  } catch (error) {
    console.error("Error fetching goals:", error.message);
    return null;
  }
};
