import axios from "axios";
import { isNumberWithTwoDecimalsAtMost } from "./isNumberWithTwoDecimalsAtMost";

export const createEnvelope = async (
  newEnvelopeName,
  newEnvelopeBudget,
  newEnvelopeCurrentAmount,
  setEnvelopes,
) => {
  if (
    typeof newEnvelopeName === "string" &&
    isNumberWithTwoDecimalsAtMost(newEnvelopeBudget) &&
    isNumberWithTwoDecimalsAtMost(newEnvelopeCurrentAmount) &&
    Number(newEnvelopeCurrentAmount) <= Number(newEnvelopeBudget)
  ) {
    try {
      const res = await axios.post("http://localhost:4001/api/envelopes", {
        name: newEnvelopeName,
        budget: newEnvelopeBudget,
        currentAmount: newEnvelopeCurrentAmount,
      });
      setEnvelopes((prevEnvelopes) => [...prevEnvelopes, res.data]);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  } else {
    console.log("typeof newEnvelopeName is: " + typeof newEnvelopeName);
    console.log(
      "isNumberWithTwoDecimalsAtMost(newEnvelopeBudget) = " +
        isNumberWithTwoDecimalsAtMost(newEnvelopeBudget),
    );
    console.log(
      "isNumberWithTwoDecimalsAtMost(newEnvelopeCurrentAmount) = " +
        isNumberWithTwoDecimalsAtMost(newEnvelopeCurrentAmount),
    );
    console.log(
      `newEnvelopeCurrentAmount <= newEnvelopeBudget is ${Number(newEnvelopeCurrentAmount) <= Number(newEnvelopeBudget)}`,
    );
    return { success: false, error: "Invalid input value(s)." };
  }
};
