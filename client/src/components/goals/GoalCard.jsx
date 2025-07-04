import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { dateDifference } from "../../util/dateDifference";
import ProgressBar from "../ui/ProgressBar";

const GoalCard = ({ goal }) => {
  const navigate = useNavigate();
  const { date } = useOutletContext();

  return (
    <div
      className="goal-card"
      onClick={() => navigate(`/goals/${goal.id}`)}
      //onTouchEnd={() => navigate(`/goals/${goal.id}`)}
    >
      <p className="goal-card__name">{goal.name}</p>
      <ProgressBar
        whole={goal.goalAmount}
        part={goal.accumulated}
        thin={true}
      />
      <p className="goal-card__deadline">
        {goal.deadline
          ? `${dateDifference(date, goal.deadline)} days remaining`
          : ""}
      </p>
    </div>
  );
};

export default GoalCard;
