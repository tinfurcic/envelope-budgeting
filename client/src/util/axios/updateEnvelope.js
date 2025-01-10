import axiosInstance from "./axiosInstance";

export const handleUpdate = async (id, name, budget, currentAmount) => {
  try {
    const res = await axiosInstance.patch(`/envelopes/${Number(id)}`, {
      name,
      budget,
      currentAmount,
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
