import { isNumberWithTwoDecimalsAtMost } from "../isNumberWithTwoDecimalsAtMost";
import axiosInstance from "./axiosInstance";

export const createEnvelope = async (
  newEnvelopeName,
  newEnvelopeBudget,
  newEnvelopeCurrentAmount,
  newEnvelopeDescription,
  newEnvelopeColor,
  setEnvelopes,
) => {
  if (
    typeof newEnvelopeName === "string" &&
    isNumberWithTwoDecimalsAtMost(newEnvelopeBudget) &&
    isNumberWithTwoDecimalsAtMost(newEnvelopeCurrentAmount) &&
    Number(newEnvelopeCurrentAmount) <= Number(newEnvelopeBudget)
  ) {
    try {
      const res = await axiosInstance.post("/envelopes", {
        name: newEnvelopeName,
        budget: newEnvelopeBudget,
        currentAmount: newEnvelopeCurrentAmount,
        description: newEnvelopeDescription,
        color: newEnvelopeColor
      });
      setEnvelopes((prevEnvelopes) => [...prevEnvelopes, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  } else {
    return { success: false, error: "Invalid input value(s)." };
  }
};
