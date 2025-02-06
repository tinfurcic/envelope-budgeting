import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import chartIcon from "../media/chart.png";

const BudgetOverview = () => {
  const { totalBudget, totalCurrentAmount } = useOutletContext();

  const [percentage, setPercentage] = useState(
    Math.round((totalCurrentAmount * 100) / totalBudget),
  );

  useEffect(() => {
    setPercentage(Math.round((totalCurrentAmount * 100) / totalBudget));
  }, [totalCurrentAmount, totalBudget]);

  return (
    <div className="budget-overview">
      <h2 className="budget-overview__heading">Budget overview</h2>
      <ProgressBar totalBudget={totalBudget} percentage={percentage} />
      <p className="legend-item">
        <span className="legend-square"></span> Money left in my envelopes
      </p>
      <p className="progress-bar-comparison">
        <img
          src={chartIcon}
          alt="comparison"
          className="progress-bar-comparison__icon"
        />
        That's <span className="bold--green">13% more</span> than usually at
        this time of the month! (62%) [placeholders]
        {/* render only if relevant data exists */}
      </p>
    </div>
  );
};

export default BudgetOverview;
