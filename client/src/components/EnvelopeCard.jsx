import React, { useState } from "react";

const EnvelopeCard = ({ envelope, fetchEnvelopes }) => {
  const [name, setName] = useState(envelope.name);
  const [budget, setBudget] = useState(envelope.budget);
  const [currentAmount, setCurrentAmount] = useState(envelope.currentAmount);

  const currency = "$"; // this should be a global setting, somewhere

  return (
    <div className="envelope-card">
      <span className="envelope-card__name">{name}</span>
      <div className="envelope-card__amount-left">
        <span className="envelope-card__amount-left--absolute">
          {currency}
          {currentAmount}
        </span>
        <span className="envelope-card__amount-left--percentage">
          ({Math.round((currentAmount * 100) / budget)}%)
        </span>
      </div>
    </div>
  );
};

export default EnvelopeCard;
