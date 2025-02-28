import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { dateDifference } from "../util/dateDifference";

import ProgressBar from "./ProgressBar";

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();
  const { date } = useOutletContext();

  return (
    <div className="goal-card" onClick={() => navigate(`/goals/${goal.id}`)}>
      <p className="goal-card__name">{goal.name}</p>
      <ProgressBar
        amount={goal.accumulated}
        budget={goal.goalAmount}
        thin={true}
      />
      <p className="goal-card__deadline">
        {goal.deadline
          ? `${dateDifference(date, goal.deadline)} days remaining`
          : ""}
      </p>
    </div>
  );

  // estimated time of completion?
  // progress bar showing the estimated increase at the end of this month
};

export default GoalCard;
