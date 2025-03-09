import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { deleteGoal } from "../util/axios/deleteFunctions";
import { updateGoal } from "../util/axios/updateFunctions";
import useCSSVariable from "../hooks/useCSSVariable";
import Button from "./Button";
import SvgEdit from "./svg-icons/SvgEdit";
import SvgCheck from "./svg-icons/SvgCheck";
import SvgPiggyBank from "./svg-icons/SvgPiggyBank";
import ProgressBar from "./ProgressBar";

const Goal = () => {
  const { id } = useParams();
  const { goals, loadingGoals, syncingGoals, savings } = useOutletContext();
  const navigate = useNavigate();

  const goal = goals.find((g) => g.id.toString() === id);

  const [editableName, setEditableName] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [editableAccumulated, setEditableAccumulated] = useState("");

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingNumbers, setIsEditingNumbers] = useState(false);

  const [accumulatedDifference, setAccumulatedDifference] = useState(0);

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
      console.log("Envelope successfully updated!");
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
    if (goal?.accumulated !== undefined) {
      setAccumulatedDifference(Number(editableAccumulated) - goal.accumulated);
    } else {
    }
  }, [goal, editableAccumulated, setAccumulatedDifference]);

  useEffect(() => {
    if (savings?.shortTermSavings?.currentAmount) {
      if (
        Number(accumulatedDifference) > savings.shortTermSavings.currentAmount
      ) {
        setEditableAccumulated(savings.shortTermSavings.currentAmount);
      }
    }
  }, [savings, accumulatedDifference, setEditableAccumulated]);

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
            <h2 className="goal__subheading">Goal overview</h2>
            <div className="goal__edit-controls">
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
                    piggyColor={isEditingNumbers ? "pink" : "black"}
                    coinColor={isEditingNumbers ? "gold" : "black"}
                    numberColor={isEditingNumbers ? "gold" : "black"}
                  />
                </Button>
              )}
            </div>
          </div>
          <ProgressBar
            budget={goal?.goalAmount ?? 1}
            amount={goal?.accumulated ?? 0}
            loading={loadingGoals}
            syncing={syncingGoals}
          />
          {isEditingNumbers && (
            <div
              className="goal__edit-funds"
              style={{ backgroundColor: goalColor }}
            >
              <div className="envelope__edit-funds__item">
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
        </div>
      </main>
    </div>
  );
};

// overview of sums put aside towards this goal?

export default Goal;
