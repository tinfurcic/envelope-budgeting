import axiosInstance from "./axiosInstance";

export const fetchGoals = async () => {
  try {
    const res = await axiosInstance.get("/goals");
    return res.data;
  } catch (err) {
    console.error("Error fetching goals:", err);
  }
};
