import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import chartIcon from "../media/chart.png";
import useScreenSize from "../hooks/useScreenSize";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  const {
    totalBudget,
    totalCurrentAmount,
    expenses,
    loadingData,
  } = useOutletContext();
  const { isSmall } = useScreenSize();
  const fakeCurrency = "€";

  const [percentage, setPercentage] = useState(
    Math.round((totalCurrentAmount * 100) / totalBudget),
  );

  useEffect(() => {
    setPercentage(Math.round((totalCurrentAmount * 100) / totalBudget));
  }, [totalCurrentAmount, totalBudget]);

  return (
    <div className="home-page">
      {isSmall && <h1 className="home-page__heading">Home</h1>}
      <div className="budget-overview">
        {/* This can be a standalone component */}
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
      <div className="latest-expenses">
        {/* this can be a standalone component */}
        <div className="latest-expenses__header">
          <h2 className="latest-expenses__heading">Latest expenses</h2>
          <Button
            type="button"
            className="button"
            onClick={null}
            variant="blue"
            isDisabled={false}
          >
            All expenses
          </Button>
        </div>

        <div className="latest_expenses__expenses">
          {loadingData ? (
            <p>Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p>You don't have any documented expenses yet.</p>
          ) : (
            <ul>
              {expenses.slice(0, 3).map((expense) => {
                return (
                  <li key={expense.id}>
                    {fakeCurrency}
                    {expense.amount}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <div className="home-page__this-month-stats">
        <h2 className="home-page__this-month-stats__heading">
          This month's stats
        </h2>
      </div>
    </div>
  );
};

export default Home;
