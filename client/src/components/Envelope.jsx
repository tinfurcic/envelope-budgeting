import React, { useState } from "react";

const Envelope = ({ envelope, fetchEnvelopes }) => {
  const [name, setName] = useState(envelope.name);
  const [budget, setBudget] = useState(envelope.budget);
  const [currentAmount, setCurrentAmount] = useState(envelope.currentAmount);

  const currency = "$"; // this should be a global setting, somewhere

  return (
    <div className="envelope">
      <span className="envelope__name">{name}</span>
      <div className="envelope__amount-left">
        <span className="envelope__amount-left--absolute">
          {currency}
          {currentAmount}
        </span>
        <span className="envelope__amount-left--percentage">
          ({Math.round((currentAmount * 100) / budget)}%)
        </span>
      </div>
    </div>
  );
};

export default Envelope;
