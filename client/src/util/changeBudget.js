import axios from "axios";
import { isNumberWithTwoDecimalsAtMost } from "./isNumberWithTwoDecimalsAtMost";

export const changeBudget = async (amount, setAmount, id) => {
  if (!isNumberWithTwoDecimalsAtMost(amount)) {
    return {
      success: false,
      error: "Input isn't a number with at most two decimals!",
    };
  }
  let endpoint;
  let body;
  if (id === -1 || id === "-1") {
    endpoint = "/budget";
    body = {
      amount: amount.toString(),
    };
  } else {
    console.log("envelope recognized");
    endpoint = `/envelopes/${id}`;
    body = {
      id: id,
      budget: amount.toString(),
    };
  }
  try {
    const res = await axios.post(`http://localhost:4001/api${endpoint}`, body);
    const newAmount = parseFloat(res.data.amount);
    setAmount(newAmount);
    return { success: true, data: newAmount };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
