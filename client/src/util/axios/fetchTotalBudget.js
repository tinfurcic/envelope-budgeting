import axiosInstance from "./axiosInstance";

export const fetchTotalBudget = async () => {
  try {
    const res = await axiosInstance.get("/budget");
    console.log("Total budget: " + parseFloat(res.data.totalBudget));
    return parseFloat(res.data.totalBudget);
  } catch (error) {
    console.log("Here comes the error in fetchTotalBudget():");
    console.error(error);
  }
};
