import axiosInstance from "./axiosInstance";

export const fetchSettings = async () => {
  try {
    const res = await axiosInstance.get("/settings");
    return res.data;
  } catch (error) {
    console.error("Error fetching settings:", error.message);
    return null;
  }
};
