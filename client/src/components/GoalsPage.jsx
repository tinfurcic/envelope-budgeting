import React from "react";
import Goal from "./Goal";
import Button from "./Button";

const GoalsPage = () => {
  return (
    <div className="goals-page">
      <div className="goals-page__header">
        <h1 className="goals-page__heading">My Goals</h1>
        <Button
          type="button"
          className="button button--blue"
          onClick={null}
        >
          New Goal
        </Button>
      </div>
      <p className="goals-page__description">
        Set Goals to increase your Long Term Savings
      </p>
      <div className="goals-page__goals">
        {/* map fetched goals here */}
        <div className="goal">
          <Goal />
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
