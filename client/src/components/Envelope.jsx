import React from "react";
import { useParams, useOutletContext } from "react-router-dom";

const Envelope = () => {
  const { id } = useParams();
  const { envelopes } = useOutletContext();

  const envelope = envelopes.find((env) => env.id.toString() === id);

  if (!envelope) {
    return <span>Envelope not found.</span>;
  }

  return (
    <div className="envelope-details">
      <h2>{envelope.name}</h2>
      <p>Budget: ${envelope.budget}</p>
      <p>Current Amount: ${envelope.currentAmount}</p>
    </div>
  );
};

export default Envelope;
