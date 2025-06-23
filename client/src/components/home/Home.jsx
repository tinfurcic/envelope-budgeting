import React from "react";
import useScreenSize from "../../hooks/useScreenSize";
import { useAuth } from "../profile/AuthContext";
import BudgetOverview from "./util/BudgetOverview";
import TodaysExpenses from "./util/TodaysExpenses";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  const { isSmall } = useScreenSize();

  return (
    <div className="home-page">
      {isSmall && <h1 className="home-page__heading">Home</h1>}
      <BudgetOverview />
      <TodaysExpenses />
      <div className="home-page__this-month-stats">
        <h2 className="home-page__this-month-stats__heading">
          This month's stats
        </h2>
      </div>
    </div>
  );
};

export default Home;
