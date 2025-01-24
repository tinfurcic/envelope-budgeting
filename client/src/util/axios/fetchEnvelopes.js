import axiosInstance from "./axiosInstance";

export const fetchEnvelopes = async () => {
  try {
    const res = await axiosInstance.get("/envelopes");
    return res.data;
  } catch (error) {
    console.error("Error fetching envelopes:", error.message);
    return null;
  }
};
