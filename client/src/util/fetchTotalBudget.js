import axios from "axios";

export const fetchTotalBudget = async () => {
  try {
    const res = await axios.get("http://localhost:4001/api/budget");
    console.log("Total budget: " + parseFloat(res.data.totalBudget));
    return parseFloat(res.data.totalBudget);
  } catch (error) {
    console.log("Here comes the error in fetchTotalBudget():");
    console.error(error);
  }
};
