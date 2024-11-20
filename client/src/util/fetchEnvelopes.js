import axios from "axios";

export const fetchEnvelopes = async () => {
  try {
    const res = await axios.get("http://localhost:4001/api/envelopes");
    return res.data;
  } catch (err) {
    console.error("fetchEnvelopes() error: " + err);
  }
};
