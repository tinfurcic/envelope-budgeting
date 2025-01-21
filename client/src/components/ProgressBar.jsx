import React, { useState, useEffect, useRef } from "react";

const ProgressBar = ({ totalBudget }) => {
  const componentRef = useRef(null);

  const fakeEnvelopeSum = 1000;
  const [percentage, setPercentage] = useState(
    Math.round((fakeEnvelopeSum * 100) / totalBudget),
  );

  useEffect(() => {
    setPercentage(Math.round((fakeEnvelopeSum * 100) / totalBudget));
  }, [fakeEnvelopeSum, totalBudget]);
  // fakeEnvelopeSum will later be a useState variable

  useEffect(() => {
    if (componentRef.current) {
      componentRef.current.style.setProperty("--bar-width", `${percentage}%`);
    }
  }, [percentage]);

  return (
    <div className="progress-bar-container">
      <div
        ref={componentRef}
        className="progress-bar-container__progress-bar"
      ></div>
      <span className="progress-bar-container__percentage">
        {totalBudget === null
          ? "Loading..."
          : totalBudget !== 0
            ? `${percentage}%`
            : "Your income is 0"}
      </span>
    </div>
  );
};

export default ProgressBar;
