import React, { useState, useEffect, useRef } from "react";
import { updateEnvelope } from "../util/axios/updateFunctions";
import { useNavigate } from "react-router-dom";

const EnvelopeCard = ({ envelope }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const [isReMovable, setIsReMovable] = useState(false);

  const fakeCurrency = "€";

  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const { height } = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty(
          "--font-size",
          `${height * 0.015}rem`,
        );
      }
    };

    window.addEventListener("resize", updateFontSize);
    updateFontSize();

    return () => window.removeEventListener("resize", updateFontSize);
  }, []);

  const handleOrderChange = async (newOrder) => {
    try {
      const result = await updateEnvelope(
        envelope.id,
        envelope.name,
        envelope.budget,
        envelope.currentAmount,
        envelope.description,
        envelope.color,
        newOrder,
      );

      if (!result.success) {
        console.error(`Error updating envelope order: ${result.error}`);
        // fail message
      }
    } catch (error) {}
  };

  return (
    <div
      className="envelope-card"
      ref={containerRef}
      onClick={() => navigate(`/envelopes/${envelope.id}`)}
      style={{ backgroundColor: envelope.color }}
    >
      <div className="envelope-card__"></div>
      <div className="envelope-card__name">
        <div className="ellipsis-wrapper">{envelope.name}</div>
      </div>
      <div className="envelope-card__amount">
        {fakeCurrency}
        {envelope.currentAmount}
      </div>
    </div>
  );
};

export default EnvelopeCard;
