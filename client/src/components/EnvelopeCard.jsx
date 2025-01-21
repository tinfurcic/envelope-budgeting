import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EnvelopeCard = ({ envelope }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { name, budget, currentAmount, id } = envelope;

  const currency = "€"; // this should be a global setting, somewhere

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
    <div
      className="envelope-card"
      ref={containerRef}
      onClick={() => navigate(`/envelopes/${id}`)}
    >
      <span className="envelope-card__name">{name}</span>
      <div className="envelope-card__amount-left">
        <span className="envelope-card__amount-absolute">
          {currency}
          {currentAmount}
        </span>
        <span className="envelope-card__amount-percentage">
          ({Math.round((currentAmount * 100) / budget)}%)
        </span>
      </div>
    </div>
  );
};

export default EnvelopeCard;
