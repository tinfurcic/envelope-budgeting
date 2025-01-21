import React from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProgressBar from "./ProgressBar";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  const { totalBudget } = useOutletContext();

  return (
    <div className="home-page">
      <h1 className="home-page__heading">Home</h1>
      <div className="budget-overview">
        <h2 className="budget-overview__heading">Budget overview</h2>
        <ProgressBar totalBudget={totalBudget} />
      </div>
      <div className="home-page__latest-expenses">
        <h2 className="home-page__latest-expenses__heading">Latest expenses</h2>
        {/* Show saved transactions, from newest to oldest */}
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
