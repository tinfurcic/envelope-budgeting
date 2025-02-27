import React, { useState, useEffect, useRef } from "react";

const ProgressBar = ({ budget, amount, thin = false, loading, syncing }) => {
  const componentRef = useRef(null);
  const [percentage, setPercentage] = useState(
    Math.round((amount * 100) / budget),
  );

  const fakeCurrency = "€";

  useEffect(() => {
    setPercentage(Math.round((amount * 100) / budget));
  }, [amount, budget]);

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.style.setProperty("--bar-width", `${percentage}%`);
    }
  }, [percentage]);

  return (
    <div
      className={`progress-bar-container progress-bar-container--${thin ? "thin" : ""}`}
    >
      <div
        ref={componentRef}
        className="progress-bar-container__progress-bar"
      ></div>
      <span className="progress-bar-container__percentage">
        {loading
          ? "Loading data..."
          : syncing
            ? "Syncing data..."
            : budget !== 0
              ? `${fakeCurrency}${amount} / ${fakeCurrency}${budget}`
              : "Your assigned budget is 0"}
      </span>
    </div>
  );
};

export default ProgressBar;
