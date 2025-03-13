import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { deleteGoal } from "../util/axios/deleteFunctions";
import { updateGoal } from "../util/axios/updateFunctions";
import { bareMinimumToAchieveGoal } from "../util/bareMinimumToAchieveGoal";
import { daysUntilNextMonth } from "../util/daysUntilNextMonth";
import { dateDifference } from "../util/dateDifference";
import useCSSVariable from "../hooks/useCSSVariable";
import SvgCalendarVar from "./svg-icons/SvgCalendar";
import SvgCheck from "./svg-icons/SvgCheck";
import SvgDeadlineVar from "./svg-icons/SvgDeadline";
import SvgEdit from "./svg-icons/SvgEdit";
import SvgGlowingStar from "./svg-icons/SvgGlowingStar";
import SvgPiggyBank from "./svg-icons/SvgPiggyBank";
import SvgSnailVar from "./svg-icons/SvgSnail";
import SvgWhiteFlag from "./svg-icons/SvgWhiteFlag";
import Button from "./Button";
import ProgressBar from "./ProgressBar";

const Goal = () => {
  const { id } = useParams();
  const { goals, loadingGoals, syncingGoals, savings, date } =
    useOutletContext();
  const navigate = useNavigate();

  const goal = goals.find((g) => g.id.toString() === id);

  const [editableName, setEditableName] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [editableAccumulated, setEditableAccumulated] = useState("");

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingNumbers, setIsEditingNumbers] = useState(false);

  let accumulatedDifference = null;
  if (goal?.accumulated !== undefined) {
    accumulatedDifference = Number(editableAccumulated) - goal.accumulated;
  }

  let isSavingInfoDisabled = true;
  let isSavingNumbersDisabled = true;
  if (
    goal &&
    goal.name !== undefined &&
    goal.description !== undefined &&
    goal.accumulated !== undefined
  ) {
    isSavingInfoDisabled =
      editableName === goal.name && editableDescription === goal.description;
    isSavingNumbersDisabled = Number(editableAccumulated) === goal.accumulated;
  }

  const fakeCurrency = "€";
  const goalColor = useCSSVariable("--goal-color");

  let barelyAchieve = null;
  if (
    goal &&
    goal.accumulated !== undefined &&
    goal.goalAmount &&
    goal.deadline
  ) {
    barelyAchieve = bareMinimumToAchieveGoal(
      goal.goalAmount - goal.accumulated,
      goal.deadline,
    );
  }

  let daysUntilDeadline = null;
  if (goal?.deadline) {
    daysUntilDeadline = dateDifference(date, goal.deadline);
  }

  // when abandoning, the sum money from the goal (i.e. long term savings) is moved to short term savings
  // when deleting a completed goal, the money stays in long term savings
  const handleDelete = async (isAbandoning) => {
    const result = await deleteGoal(id, isAbandoning);
    if (!result.success) {
      console.error(result.error);
    } else {
      console.log(result.message);
      navigate("/goals");
    }
  };

  useEffect(() => {
    if (goal) {
      setEditableName(goal.name);
      setEditableAccumulated(goal.accumulated !== 0 ? goal.accumulated : "");
      setEditableDescription(goal.description);
    }
  }, [goal]);

  // --- Edit mode buttons and discarding unsaved changes section ---
  const toggleEditInfoMode = () => {
    if (
      goal &&
      goal.name &&
      goal.description !== undefined &&
      goal.accumulated !== undefined
    ) {
      if (isEditingInfo) {
        // turning editInfoMode off
        setEditableName(goal.name);
        setEditableDescription(goal.description);
      } else {
        // if turning editInfoMode on, turn editNumbersMode off
        if (isEditingNumbers) {
          setEditableAccumulated(
            goal.accumulated !== 0 ? goal.accumulated : "",
          );
          setIsEditingNumbers(false);
        }
      }
    }
    setIsEditingInfo(!isEditingInfo);
  };

  const toggleEditNumbersMode = () => {
    if (goal?.accumulated !== undefined) {
      if (isEditingNumbers) {
        setEditableAccumulated(goal.accumulated !== 0 ? goal.accumulated : "");
      } else {
        if (isEditingInfo) {
          setEditableName(goal.name);
          setEditableDescription(goal.description);
          setIsEditingInfo(false);
        }
      }
    }
    setIsEditingNumbers(!isEditingNumbers);
  };

  // --- onChange and save handlers section ---
  const handleNameChange = (e) => {
    setEditableName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setEditableDescription(e.target.value);
  };

  const handleSaveInfo = async () => {
    const result = await updateGoal(
      id,
      editableName,
      goal.goalAmount,
      goal.deadline,
      goal.accumulated,
      editableDescription,
    );

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      console.log("Goal successfully updated!");
      toggleEditInfoMode();
    }
  };

  const handleSaveNumbers = async () => {
    const result = await updateGoal(
      id,
      goal.name,
      goal.goalAmount,
      goal.deadline,
      Number(editableAccumulated),
      goal.description,
    );

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      console.log("Goal successfully updated!");
      toggleEditNumbersMode();
    }
  };

  // --- Number inputs handling section ---
  const handleValueChange = (event, setValue) => {
    let value = event.target.value;
    value = value.replace(/,/g, ".");
    const regex = /^(|0|0\.|0\.\d{1,2}|[1-9]\d*(\.|\.\d{1,2})?)$/;
    if (regex.test(value)) {
      setValue(value);
    }
  };

  useEffect(() => {
    if (
      savings?.shortTermSavings?.currentAmount !== undefined &&
      goal?.accumulated !== undefined &&
      goal?.goalAmount
    ) {
      if (
        Number(accumulatedDifference) >=
          savings.shortTermSavings.currentAmount &&
        Number(editableAccumulated) > goal.goalAmount
      ) {
        const boundary = Math.min(
          savings.shortTermSavings.currentAmount + goal.accumulated,
          goal.goalAmount,
        );
        setEditableAccumulated(boundary);
      } else if (
        Number(accumulatedDifference) >= savings.shortTermSavings.currentAmount
      ) {
        setEditableAccumulated(
          savings.shortTermSavings.currentAmount + goal.accumulated,
        );
      } else if (Number(editableAccumulated) > goal.goalAmount) {
        setEditableAccumulated(goal.goalAmount);
      }
    }
  }, [
    savings,
    goal,
    accumulatedDifference,
    editableAccumulated,
    setEditableAccumulated,
  ]);

  return (
    <div className="goal">
      <header className="goal__header">
        <div className="goal__header-row">
          <div className="goal__header-content">
            {isEditingInfo ? (
              <input
                type="text"
                className="goal__name-input"
                value={editableName}
                onChange={handleNameChange}
                maxLength="30"
              />
            ) : (
              <h1
                className={`goal__name ${loadingGoals || syncingGoals ? "goal__name--small" : ""}`}
              >
                {loadingGoals
                  ? "Loading name..."
                  : syncingGoals
                    ? "Syncing name"
                    : editableName}
              </h1>
            )}

            {isEditingInfo ? (
              <textarea
                className="goal__description-input"
                value={editableDescription}
                onChange={handleDescriptionChange}
              />
            ) : (
              <p className="goal__description">
                {loadingGoals
                  ? "Loading description..."
                  : syncingGoals
                    ? "Syncing description"
                    : editableDescription || "No description"}
              </p>
            )}
          </div>

          <div className="goal__header-bar">
            <Button
              className="button button--back"
              onClick={() => navigate("/goals")}
            >
              X
            </Button>

            <Button
              className="button button--edit"
              onClick={toggleEditInfoMode}
              extraStyle={isEditingInfo ? { backgroundColor: "black" } : {}}
            >
              <SvgEdit
                fillColor={isEditingInfo ? goalColor : "black"}
                strokeColor={isEditingInfo ? goalColor : "black"}
              />
            </Button>

            {!isSavingInfoDisabled && isEditingInfo && (
              <Button
                className="button button--edit"
                onClick={handleSaveInfo}
                isDisabled={isSavingInfoDisabled}
              >
                <SvgCheck fillColor="black" strokeColor="black" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main>
        <div className="goal__overview">
          <div className="goal__subheading-container">
            <div className="goal__subheading-container__group">
              <h2 className="goal__subheading">Goal overview</h2>
              {goal?.accumulated !== goal?.goalAmount ? (
                <Button
                  className="button button--abandon-goal"
                  onClick={() => handleDelete("true")}
                >
                  <SvgWhiteFlag />
                </Button>
              ) : (
                <Button
                  className="button button--complete-goal"
                  onClick={() => handleDelete("false")}
                >
                  <SvgGlowingStar />
                </Button>
              )}
            </div>

            <div className="goal__subheading-container__group">
              {isEditingNumbers && !isSavingNumbersDisabled && (
                <Button
                  className="button button--edit"
                  onClick={handleSaveNumbers}
                  isDisabled={isSavingNumbersDisabled}
                >
                  <SvgCheck fillColor="black" strokeColor="black" />
                </Button>
              )}
              {!isEditingInfo && (
                <Button
                  className={`button button--edit`}
                  onClick={toggleEditNumbersMode}
                  extraStyle={
                    isEditingNumbers ? { backgroundColor: "black" } : {}
                  }
                >
                  <SvgPiggyBank
                    piggyColor={isEditingNumbers ? "#e59fc2" : "black"}
                    coinColor={isEditingNumbers ? "#bcbc10" : "black"}
                    numberColor={isEditingNumbers ? "#bcbc10" : "black"}
                  />
                </Button>
              )}
            </div>
          </div>
          <ProgressBar
            whole={goal?.goalAmount ?? 1}
            part={goal?.monthStart ?? 0}
            secondPart={
              goal?.accumulated !== undefined && goal?.monthStart !== undefined
                ? goal.accumulated - goal.monthStart
                : 0
            }
            loading={loadingGoals}
            syncing={syncingGoals}
          />
          {isEditingNumbers && (
            <div
              className="goal__edit-funds"
              style={{ backgroundColor: goalColor }}
            >
              <div className="goal__edit-funds__item">
                <div className="label-difference-container">
                  <label className="label" htmlFor="amount">
                    New Amount
                  </label>
                  <span
                    className={`funds-difference funds-difference--${accumulatedDifference > 0 ? "positive" : accumulatedDifference < 0 ? "negative" : ""}`}
                  >
                    {goal?.accumulated !== undefined &&
                      accumulatedDifference !== 0 &&
                      `${accumulatedDifference > 0 ? "+" : "-"} ${fakeCurrency}${Math.abs(goal.accumulated - Number(editableAccumulated)).toFixed(2)}`}
                  </span>
                </div>
                <div className="input-with-currency">
                  <span className="input-with-currency__currency">
                    {fakeCurrency}
                  </span>
                  <input
                    className="input-with-currency__input"
                    type="text"
                    value={editableAccumulated}
                    onChange={(e) =>
                      handleValueChange(e, setEditableAccumulated)
                    }
                    id="amount"
                    name="amount"
                  />
                </div>
              </div>
            </div>
          )}

          <ul className="goal__stats-list">
            <li className="goal__stats-list__item">
              <SvgCalendarVar size={30} />
              New income in {daysUntilNextMonth()} days
            </li>
            <li className="goal__stats-list__item">
              <SvgSnailVar size={30} />
              Min. monthly allocation: {fakeCurrency}
              {barelyAchieve}
            </li>
            <li className="goal__stats-list__item">
              <SvgDeadlineVar size={30} />
              Deadline in {daysUntilDeadline} days
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Goal;
