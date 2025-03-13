import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { calcTotalBudget } from "../util/calcTotalBudget";
import { calcTotalCurrentAmount } from "../util/calcTotalCurrentAmount";
import ProgressBar from "./ProgressBar";
import chartIcon from "../media/chart.png";

const BudgetOverview = () => {
  const { envelopes, loadingEnvelopes, syncingEnvelopes } = useOutletContext();

  const [totalBudget, setTotalBudget] = useState(null);
  const [totalCurrentAmount, setTotalCurrentAmount] = useState(null);

  useEffect(() => {
    setTotalBudget(calcTotalBudget(envelopes));
    setTotalCurrentAmount(calcTotalCurrentAmount(envelopes));
  }, [envelopes]);

  return (
    <div className="budget-overview">
      <h2 className="budget-overview__heading">Budget overview</h2>
      <ProgressBar
        whole={totalBudget}
        part={totalCurrentAmount}
        loading={loadingEnvelopes}
        syncing={syncingEnvelopes}
      />
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
