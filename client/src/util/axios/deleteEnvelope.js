import axiosInstance from "./axiosInstance";

export const deleteEnvelope = async (id, setEnvelopes) => {
  try {
    await axiosInstance.delete(`/envelopes/${id}`);
    setEnvelopes((prevEnvelopes) => prevEnvelopes.filter((envelope) => envelope.id !== id));
  } catch (error) {
    console.error("Error deleting envelope:", error);
  }
};
