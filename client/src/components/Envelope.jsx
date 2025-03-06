import React, { useState, useEffect } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import { updateEnvelope } from "../util/axios/updateFunctions";
import expenseIcon from "../media/expense.png";
import useCSSVariable from "../hooks/useCSSVariable";
import useOverlapping from "../hooks/useOverlapping";
import useScreenSize from "../hooks/useScreenSize";
import SvgEditIcon from "./SvgEditIcon";
import SvgCheckIcon from "./SvgCheckIcon";
import SvgEnvelopeCash from "./SvgEnvelopeCash";
import ProgressBar from "./ProgressBar";
import ExpensesTable from "./ExpensesTable";
import Button from "./Button";
import Colors from "./Colors";

const Envelope = () => {
  const { id } = useParams();
  const {
    envelopes,
    loadingEnvelopes,
    syncingEnvelopes,
    expenses,
    loadingExpenses,
    syncingExpenses,
    income,
    savings,
    budgetSum,
  } = useOutletContext();
  const navigate = useNavigate();

  const { isSmall } = useScreenSize();

  const isButtonOverlapping = useOverlapping(
    ".envelope",
    ".new-expense-button",
    [".envelope__latest-expenses"],
    500,
    [envelopes],
  );

  const envelope = envelopes.find((env) => env.id.toString() === id);

  const [latestExpenses, setLatestExpenses] = useState(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingNumbers, setIsEditingNumbers] = useState(false);
  const [editableName, setEditableName] = useState(null);
  const [editableDescription, setEditableDescription] = useState(null);
  const [editableColor, setEditableColor] = useState(null);
  const [editableAmount, setEditableAmount] = useState("");
  const [editableBudget, setEditableBudget] = useState("");
  const [budgetDifference, setBudgetDifference] = useState(0);
  const [amountDifference, setAmountDifference] = useState(0);

  let isSavingInfoDisabled = true;
  let isSavingNumbersDisabled = true;
  if (
    envelope &&
    envelope.name !== undefined &&
    envelope.description !== undefined &&
    envelope.color &&
    envelope.budget !== undefined &&
    envelope.currentAmount !== undefined
  ) {
    isSavingInfoDisabled =
      editableName === envelope.name &&
      editableDescription === envelope.description &&
      editableColor === envelope.color;
    isSavingNumbersDisabled =
      Number(editableBudget) === envelope.budget &&
      Number(editableAmount) === envelope.currentAmount;
  }

  const fakeCurrency = "€";
  const backgroundColor = useCSSVariable("--background-color");

  // Set editable variables
  useEffect(() => {
    if (envelope) {
      setEditableName(envelope.name);
      setEditableDescription(envelope.description);
      setEditableColor(envelope.color);
      setEditableAmount(envelope.currentAmount);
      setEditableBudget(envelope.budget);
    }
  }, [envelope]);

  // --- Edit mode buttons and discarding unsaved changes section ---
  const toggleEditInfoMode = () => {
    if (
      envelope &&
      envelope.name &&
      envelope.description !== undefined &&
      envelope.color &&
      envelope.budget &&
      envelope.currentAmount
    ) {
      if (isEditingInfo) {
        // turning editInfoMode off
        setEditableName(envelope.name);
        setEditableDescription(envelope.description);
        setEditableColor(envelope.color);
      } else {
        // if turning editInfoMode on, turn editNumbersMode off
        if (isEditingNumbers) {
          setEditableBudget(envelope.budget);
          setEditableAmount(envelope.currentAmount);
          setIsEditingNumbers(false);
        }
      }
    }
    setIsEditingInfo(!isEditingInfo);
  };

  const toggleEditNumbersMode = () => {
    if (
      envelope &&
      envelope.budget &&
      envelope.currentAmount &&
      envelope.name &&
      envelope.description !== undefined &&
      envelope.color
    ) {
      if (isEditingNumbers) {
        setEditableBudget(envelope.budget);
        setEditableAmount(envelope.currentAmount);
      } else {
        if (isEditingInfo) {
          setEditableName(envelope.name);
          setEditableDescription(envelope.description);
          setEditableColor(envelope.color);
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
    const result = await updateEnvelope(
      id,
      editableName,
      envelope.budget,
      envelope.currentAmount,
      editableDescription,
      editableColor,
      envelope.order,
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
    const result = await updateEnvelope(
      id,
      envelope.name,
      Number(editableBudget),
      Number(editableAmount),
      envelope.description,
      envelope.color,
      envelope.order,
    );

    if (!result.success) {
      // display error message
      console.error(result.error);
    } else {
      // display success message
      console.log("Envelope successfully updated!");
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
    if (envelope?.budget) {
      setBudgetDifference(editableBudget - envelope.budget);
    }
  }, [envelope, editableBudget, setBudgetDifference]);

  useEffect(() => {
    if (envelope?.currentAmount) {
      setAmountDifference(editableAmount - envelope.currentAmount);
    }
  }, [envelope, editableAmount, setAmountDifference]);

  useEffect(() => {
    if (
      savings?.shortTermSavings?.currentAmount &&
      savings?.longTermSavings?.currentAmount
    ) {
      if (Number(amountDifference) > savings.shortTermSavings.currentAmount) {
        console.log("This action will draw funds from your long-term savings!");
        if (
          Number(amountDifference) >
          savings.longTermSavings.currentAmount +
            savings.longTermSavings.currentAmount
        ) {
          setEditableAmount(
            savings.shortTermSavings.currentAmount +
              savings.longTermSavings.currentAmount,
          );
        }
      }
    }
  }, [savings, amountDifference, setEditableAmount]);

  useEffect(() => {
    if (income?.regularIncome?.value && envelope?.budget && budgetSum) {
      const maxBudget =
        income.regularIncome.value - budgetSum + envelope.budget;
      if (parseFloat(editableBudget) > maxBudget) {
        setEditableBudget(maxBudget.toFixed(2).toString());
      }
    }
  }, [envelope, income, editableBudget, budgetSum]);

  // Load latest expenses
  useEffect(() => {
    if (envelope && expenses) {
      setLatestExpenses(
        expenses.filter((expense) =>
          expense.sources.some((source) => source.id === envelope.id),
        ),
      );
    }
  }, [expenses, envelope]);

  return (
    <div className="envelope">
      <header
        className="envelope__header"
        style={{ "--envelope-color": editableColor }}
      >
        <div className="envelope__header-row">
          <div className="envelope__header-content">
            {isEditingInfo ? (
              <input
                type="text"
                className="envelope__name-input"
                value={editableName}
                onChange={handleNameChange}
                maxLength="30"
              />
            ) : (
              <h1
                className={`envelope__name ${loadingEnvelopes || syncingEnvelopes ? "envelope__name--small" : ""}`}
              >
                {loadingEnvelopes
                  ? "Loading name..."
                  : syncingEnvelopes
                    ? "Syncing name"
                    : editableName}
              </h1>
            )}

            {isEditingInfo ? (
              <textarea
                className="envelope__description-input"
                value={editableDescription}
                onChange={handleDescriptionChange}
              />
            ) : (
              <p className="envelope__description">
                {loadingEnvelopes
                  ? "Loading description..."
                  : syncingEnvelopes
                    ? "Syncing description"
                    : editableDescription || "No description"}
              </p>
            )}
          </div>

          <div className="envelope__header-bar">
            <Button
              className="button button--back"
              onClick={() => navigate("/envelopes")}
            >
              X
            </Button>

            {!isEditingNumbers && (
              <Button
                className="button button--edit"
                onClick={toggleEditInfoMode}
                extraStyle={isEditingInfo ? { backgroundColor: "black" } : {}}
              >
                <SvgEditIcon
                  fillColor={isEditingInfo ? editableColor : "black"}
                  strokeColor={isEditingInfo ? editableColor : "black"}
                />
              </Button>
            )}

            {!isSavingInfoDisabled && isEditingInfo && (
              <Button
                className="button button--edit"
                onClick={handleSaveInfo}
                isDisabled={isSavingInfoDisabled}
              >
                <SvgCheckIcon fillColor="black" strokeColor="black" />
              </Button>
            )}
          </div>
        </div>

        {isEditingInfo ? (
          <div className="envelope__color-input">
            <Colors
              newEnvelopeColor={editableColor}
              setNewEnvelopeColor={setEditableColor}
              currentColor={envelope.color}
            />
          </div>
        ) : null}
      </header>
      <main>
        <div className="envelope__overview">
          <div className="envelope__subheading-container">
            <h2 className="envelope__subheading">Budget overview</h2>
            <div className="envelope__edit-controls">
              {isEditingNumbers && !isSavingNumbersDisabled && (
                <Button
                  className="button button--edit"
                  onClick={handleSaveNumbers}
                  isDisabled={isSavingNumbersDisabled}
                >
                  <SvgCheckIcon fillColor="black" strokeColor="black" />
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
                  <SvgEnvelopeCash
                    fillColor={isEditingNumbers ? backgroundColor : "black"}
                  />
                </Button>
              )}
            </div>
          </div>
          <ProgressBar
            budget={envelope?.budget ?? 1}
            amount={envelope?.currentAmount ?? 0}
            loading={loadingEnvelopes}
            syncing={syncingEnvelopes}
          />
          {isEditingNumbers && (
            <div
              className="envelope__edit-funds"
              style={{ backgroundColor: editableColor }}
            >
              <div className="envelope__edit-funds__item">
                <div className="label-difference-container">
                  <label className="label" htmlFor="budget">
                    New Budget
                  </label>
                  <span
                    className={`funds-difference funds-difference--${budgetDifference > 0 ? "positive" : budgetDifference < 0 ? "negative" : ""}`}
                  >
                    {envelope?.budget &&
                      budgetDifference !== 0 &&
                      `${budgetDifference > 0 ? "+" : "-"} ${fakeCurrency}${Math.abs(envelope.budget - Number(editableBudget)).toFixed(2)}`}
                  </span>
                </div>
                <div className="input-with-currency">
                  <span className="input-with-currency__currency">
                    {fakeCurrency}
                  </span>
                  <input
                    className="input-with-currency__input"
                    type="text"
                    value={editableBudget}
                    onChange={(e) => handleValueChange(e, setEditableBudget)}
                    id="budget"
                    name="budget"
                  />
                </div>
              </div>

              <div className="envelope__edit-funds__item">
                <div className="label-difference-container">
                  <label className="label" htmlFor="amount">
                    New Amount
                  </label>
                  <span
                    className={`funds-difference funds-difference--${amountDifference > 0 ? "positive" : amountDifference < 0 ? "negative" : ""}`}
                  >
                    {envelope &&
                      envelope.currentAmount &&
                      amountDifference !== 0 &&
                      `${amountDifference > 0 ? "+" : "-"} ${fakeCurrency}${Math.abs(envelope.currentAmount - Number(editableAmount)).toFixed(2)}`}
                  </span>
                </div>
                <div className="input-with-currency">
                  <span className="input-with-currency__currency">
                    {fakeCurrency}
                  </span>
                  <input
                    className="input-with-currency__input"
                    type="text"
                    value={editableAmount}
                    onChange={(e) => handleValueChange(e, setEditableAmount)}
                    id="amount"
                    name="amount"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="envelope__latest-expenses">
          <h2 className="envelope__subheading">Latest expenses</h2>
          {loadingExpenses || latestExpenses === null ? (
            <p>Loading expenses...</p>
          ) : syncingExpenses ? (
            <p>Syncing expenses...</p>
          ) : latestExpenses.length === 0 ? (
            <p>No expenses this month.</p>
          ) : (
            <ExpensesTable
              dateWindow="latest"
              expenses={latestExpenses}
              envelope={envelope}
            />
          )}
        </div>

        <h2 className="envelope__subheading">This month's expenses</h2>

        <div
          className={`new-expense-button ${isButtonOverlapping ? "overlapping" : ""} ${isSmall ? "large-margin" : "small-margin"}`}
        >
          <Button
            className={`button button--new-expense`}
            onClick={() =>
              navigate("/expense", {
                state: {
                  category: "envelope",
                  sourceData: {
                    id: envelope.id,
                    type: "envelope",
                    name: envelope.name,
                    amount: 0,
                    order: envelope.order,
                  },
                  activeCategory: "envelope",
                  sourceId: envelope.id,
                },
              })
            }
          >
            <img src={expenseIcon} alt="New expense" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Envelope;
