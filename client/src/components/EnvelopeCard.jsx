import React, { useState, useRef, useEffect } from "react";

const EnvelopeCard = ({ envelope, fetchEnvelopes }) => {
  const containerRef = useRef(null);
  const [name, setName] = useState(envelope.name);
  const [budget, setBudget] = useState(envelope.budget);
  const [currentAmount, setCurrentAmount] = useState(envelope.currentAmount);

  const currency = "$"; // this should be a global setting, somewhere

  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const { height } = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty(
          "--font-size",
          `${height * 0.01333}rem`,
        );
      }
    };

    window.addEventListener("resize", updateFontSize);
    updateFontSize();

    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  return (
    <div className="envelope-card" ref={containerRef}>
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
