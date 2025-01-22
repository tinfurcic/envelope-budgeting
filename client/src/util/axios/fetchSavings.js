import axiosInstance from "./axiosInstance";

export const fetchSavings = async () => {
  try {
    const res = await axiosInstance.get("/savings");
    return res.data;
  } catch (error) {
    console.error("Error fetching savings:", error.message);
    return null;
  }
};
