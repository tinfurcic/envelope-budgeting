import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import GoalCard from "./GoalCard";
import Button from "./Button";

const GoalsPage = () => {
  const navigate = useNavigate();
  const { goals, loadingGoals, syncingGoals } = useOutletContext();

  return (
    <div className="goals-page">
      <div className="goals-page__header">
        <h1 className="goals-page__heading">My Goals</h1>
        <Button
          className="button button--blue"
          onClick={() => navigate("/create-goal")}
          //onTouchEnd={() => navigate("/create-goal")}
        >
          New Goal
        </Button>
      </div>

      <div className="goals-page__goals">
        {loadingGoals ? (
          <span className="goals-page__loading-message">
            Loading your goals...
          </span>
        ) : syncingGoals ? (
          <span className="goals-page__loading-message">
            Syncing your goals...
          </span>
        ) : goals.length === 0 ? (
          <div className="goals-page__no-items">
            <span className="goals-page__no-items-message">
              You don't have any goals yet. Create one!
            </span>
          </div>
        ) : (
          <div className="goals-page__cards-container">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// show short-/long-term savings?
// show percentage of income set aside this month toward achieving goals?

export default GoalsPage;
