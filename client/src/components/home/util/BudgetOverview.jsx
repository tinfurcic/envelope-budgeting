import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { calcTotalBudget } from "../../../util/calcTotalBudget";
import { calcTotalCurrentAmount } from "../../../util/calcTotalCurrentAmount";
import ProgressBar from "../../ui/ProgressBar";

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
      <div className="legend-item">
        <svg width="16" height="16" className="legend-icon">
          <use href="#square-rounded" />
        </svg>
        Money left in my envelopes
      </div>
      <div className="legend-item">
        <svg width="16" height="16" className="legend-icon">
          <use href="#analytics-up" />
        </svg>
        That's <span className="bold--green">13% more</span> than usually at
        this time of the month! (62%) [placeholders]
        {/* render only if relevant data exists */}
      </div>
    </div>
  );
};

export default BudgetOverview;
