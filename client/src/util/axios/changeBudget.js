import { isNumberWithTwoDecimalsAtMost } from "../isNumberWithTwoDecimalsAtMost";
import axiosInstance from "./axiosInstance";

export const changeBudget = async (amount, setAmount, id) => {
  if (!isNumberWithTwoDecimalsAtMost(amount)) {
    return {
      success: false,
      error: "Input isn't a number with at most two decimals!",
    };
  }
  let endpoint;
  let method;
  let body;
  if (id === -1 || id === "-1") {
    method = "post";
    endpoint = "/budget";
    body = {
      amount: amount.toString(),
    };
  } else {
    console.log("envelope recognized");
    method = "patch";
    endpoint = `/envelopes/${id}`;
    body = {
      id: id,
      budget: amount.toString(),
    };
  }
  try {
    const res = await axiosInstance[method](`${endpoint}`, body);
    const newAmount = parseFloat(res.data.amount);
    setAmount(newAmount);
    return { success: true, data: newAmount };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
