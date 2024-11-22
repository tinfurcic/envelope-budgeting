import axiosInstance from "./axiosInstance";
import { fetchEnvelopes } from "./fetchEnvelopes";

export const handleTransfer = async (
  givingEnvelopeId,
  receivingEnvelopeId,
  amount,
) => {
  try {
    await axiosInstance.post(
      `/envelopes/transfer/${givingEnvelopeId}/${receivingEnvelopeId}/${amount}`,
    );
    fetchEnvelopes(); // Refresh envelopes after transfer
  } catch (err) {
    console.error("handleTransfer() error: " + err);
  }
};
