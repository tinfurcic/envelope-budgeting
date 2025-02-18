import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { createExpense } from "../util/axios/createFunctions";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import PickSingleSource from "./PickSingleSource";
import backArrow from "../media/back-arrow.png";
import PickMultipleSources from "./PickMultipleSources";

const NewExpensePage = () => {
  const { envelopes, savings, loadingExpenses, syncingExpenses, date } =
    useOutletContext();
  const navigate = useNavigate();

  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseDate, setNewExpenseDate] = useState("");
  const [newExpenseSources, setNewExpenseSources] = useState([]);
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [isTodayChecked, setIsTodayChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sourceCategory, setSourceCategory] = useState(null);
  const [allowMultipleSources, setAllowMultipleSources] = useState(false);

  const fakeCurrency = "€";

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      const correctTypeExpenseSources = newExpenseSources.map((source) => ({
        ...source,
        id: Number(source.id),
        amount: Number(source.amount),
        order: Number(source.order),
      }));
      const result = await createExpense(
        Number(newExpenseAmount),
        newExpenseDate,
        correctTypeExpenseSources,
        newExpenseDescription,
        false, // isLockedIn
      );

      if (!result.success) {
        console.error(`Error creating expense: ${result.error}`);
        // fail message
        return;
      } else {
        console.log("Expense created and paid successfully!");
        // success message
        setNewExpenseAmount("");
        setNewExpenseSources([]);
        setNewExpenseDescription("");
        setSourceCategory(null);
        setAllowMultipleSources(false);
      }
    } catch (error) {
      console.error(
        "Error during expense creation and payment:",
        error.message,
      );
      // fail message
    }
  };

  const handleValueChange = (event, setValue) => {
    let value = event.target.value;
    value = value.replace(/,/g, ".");
    const regex = /^(|0|0\.|0\.\d{1,2}|[1-9]\d*(\.|\.\d{1,2})?)$/;
    if (regex.test(value)) {
      setValue(value);
    }
  };

  // --- Everything related do multiple sources ---
  const handleSourcesCheckboxChange = (event) => {
    setAllowMultipleSources(event.target.checked);
  };

  useEffect(() => {
    setNewExpenseSources([]);
    setSourceCategory(null);
  }, [allowMultipleSources]);

  useEffect(() => {
    let totalSum = 0;
    let hasEmptyField = false;
    for (const source of newExpenseSources) {
      if (Number(source.amount) === 0) {
        hasEmptyField = true;
        break;
      }
      totalSum += Number(source.amount);
    }
    setIsDisabled(
      Number(newExpenseAmount) === 0 ||
        newExpenseDate === "" ||
        newExpenseSources.length === 0 ||
        hasEmptyField ||
        Number(totalSum) !== Number(newExpenseAmount),
    );
  }, [newExpenseAmount, newExpenseDate, newExpenseSources]);

  // --- Everything related to date ---
  const handleTodayCheckboxChange = (event) => {
    setIsTodayChecked(event.target.checked);
    setNewExpenseDate(event.target.checked ? date : "");
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    if (selectedDate === date) {
      setIsTodayChecked(true);
    } else {
      setIsTodayChecked(false);
    }
    setNewExpenseDate(selectedDate);
  };

  useEffect(() => {
    if (isTodayChecked) {
      setNewExpenseDate(date);
    }
  }, [date, isTodayChecked]);

  useEffect(() => {
    if (newExpenseDate === date) {
      setIsTodayChecked(true);
    }
  }, [newExpenseDate, date]);

  return (
    <div className="new-expense-page">
      <div className="new-expense-page__nav-back">
        <Button
          type="button"
          className="button button--back"
          onClick={() => navigate("/envelopes")}
        >
          <img src={backArrow} alt="Back" width="20" /> to My Envelopes
        </Button>
      </div>

      <h1 className="new-expense-page__heading">New Expense</h1>
      <p className="new-expense-page__description">
        Add a new expense and choose the source(s) to pay from.
      </p>

      <form
        onSubmit={handleCreateExpense}
        className="new-expense-page__form"
        autoComplete="off"
      >
        <div className="form-item">
          <label className="form-label" htmlFor="amount">
            {`${allowMultipleSources ? "Total amount" : "Amount"}`}
          </label>
          <div className="input-with-currency">
            <span className="input-with-currency__currency">
              {fakeCurrency}
            </span>
            <input
              className="form-input input-with-currency__input"
              type="text"
              value={newExpenseAmount}
              onChange={(e) => handleValueChange(e, setNewExpenseAmount)}
              id="amount"
              name="amount"
            />
          </div>
        </div>

        <div className="form-item">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <div className="form-item__date">
            <input
              className="form-item__date__input form-input"
              type="date"
              value={newExpenseDate}
              onChange={handleDateChange}
              id="date"
              name="date"
            />
            <input
              className="form-item__date__checkbox"
              type="checkbox"
              id="today"
              name="today"
              checked={isTodayChecked}
              onChange={handleTodayCheckboxChange}
            />
            <label className="checkbox-label" htmlFor="today">
              Today
            </label>
          </div>
        </div>

        <div className="form-item">
          {loadingExpenses ? (
            <p className="form-p">Loading data...</p>
          ) : syncingExpenses ? (
            <p className="form-p">Syncing data...</p>
          ) : (
            <>
              <div className="source-mode">
                <p className="form-p">{allowMultipleSources ? "Sources" : "Source"}</p>
                <div>
                  <input
                    type="checkbox"
                    id="sources"
                    checked={allowMultipleSources}
                    onChange={handleSourcesCheckboxChange}
                    className="source-input"
                  />
                  <label htmlFor="sources">Allow multiple sources</label>
                </div>
              </div>

              {allowMultipleSources ? (
                <PickMultipleSources
                  newExpenseAmount={newExpenseAmount}
                  newExpenseSources={newExpenseSources}
                  setNewExpenseSources={setNewExpenseSources}
                  envelopes={envelopes}
                  savings={savings}
                />
              ) : (
                <PickSingleSource
                  newExpenseAmount={newExpenseAmount}
                  setNewExpenseSources={setNewExpenseSources}
                  sourceCategory={sourceCategory}
                  setSourceCategory={setSourceCategory}
                  envelopes={envelopes}
                  savings={savings}
                />
              )}
            </>
          )}
        </div>

        <div className="form-item">
          <label className="form-label" htmlFor="description">
            Description (optional)
          </label>
          <input
            className="form-input"
            type="text"
            value={newExpenseDescription}
            onChange={(e) => setNewExpenseDescription(e.target.value)}
            id="description"
            name="description"
          />
        </div>

        <div className="form-item__submit-btn">
          <Button
            type="submit"
            className="button button--green"
            onClick={null}
            isDisabled={isDisabled}
          >
            Add Expense
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewExpensePage;
