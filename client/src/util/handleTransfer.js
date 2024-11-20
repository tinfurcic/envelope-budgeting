import axios from "axios";
import { fetchEnvelopes } from "./fetchEnvelopes";

export const handleTransfer = async (
  givingEnvelopeId,
  receivingEnvelopeId,
  amount,
) => {
  try {
    await axios.post(
      `http://localhost:4001/api/envelopes/transfer/${givingEnvelopeId}/${receivingEnvelopeId}/${amount}`,
    );
    fetchEnvelopes(); // Refresh envelopes after transfer
  } catch (err) {
    console.error("handleTransfer() error: " + err);
  }
};
