import React from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProgressBar from "./ProgressBar";
import Button from "./Button";
import gearIcon from "../media/gear-icon.png";

const Home = () => {
  const { user } = useAuth();
  console.log(user);
  const { totalBudget } = useOutletContext();

  return (
    <>
      <div className="budget-overview">
        <div className="budget-overview__header">
          <h2>My funds</h2>
          <Button type="button" className="button" navigateTo="/funds" variant="blue" isDisabled={false} >
            <img
              src={gearIcon}
              alt="Gear Icon"
              className="button__gear-icon"
              width="16"
            ></img>{" "}
            Manage funds
          </Button>
        </div>
        <ProgressBar totalBudget={totalBudget} />
      </div>
      <div className="latest-expenses">
        <h2>Latest expenses</h2>
        {/* Show saved transactions, from newest to oldest */}
      </div>
      <div className="this-month-stats">
        <h2>This month's stats</h2>
      </div>
    </>
  );
};

export default Home;