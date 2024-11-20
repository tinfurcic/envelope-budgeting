import React, { useState } from "react";

const BudgetManager = () => {
  const [income, setIncome] = useState(2200);
  const currency = "$"; // this should be a global setting, somewhere

  return (
    <div className="budget-manager">
      <div className="budget-manager__income">
        <span>
          Total monthly income: {currency}
          {income}
        </span>
        <button>Change</button>
      </div>
      <div className="budget-manager__budget">
        <span>This month's budget: {currency}passMe</span>
        <button>Change</button>
      </div>
      <span>Unassigned budget: {currency}passMe</span>
      <h4>Envelopes overview</h4>
      <div className="budget-manager__envelopes"></div>
    </div>
  );
};

export default BudgetManager;
