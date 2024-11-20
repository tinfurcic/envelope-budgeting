import axios from "axios";

export const handleUpdate = async (id, name, budget, currentAmount) => {
  try {
    const res = await axios.patch(
      `http://localhost:4001/api/envelopes/${Number(id)}`,
      {
        name,
        budget,
        currentAmount,
      },
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
