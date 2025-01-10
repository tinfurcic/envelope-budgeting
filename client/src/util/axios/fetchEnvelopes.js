import axiosInstance from "./axiosInstance";

export const fetchEnvelopes = async () => {
  try {
    const res = await axiosInstance.get("/envelopes");
    return res.data;
  } catch (err) {
    console.error("fetchEnvelopes() error: " + err);
  }
};
