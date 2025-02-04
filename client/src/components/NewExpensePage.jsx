import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { createExpense } from "../util/axios/createFunctions";
import { payExpense } from "../util/payExpense";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import SourceSelectRaw from "./SourceSelectRaw";
import backArrow from "../media/back-arrow.png";
import SourceCheckboxRaw from "./SourceCheckboxRaw";

const NewExpensePage = () => {
  const { setExpenses, envelopes, savings, loadingData, date } =
    useOutletContext();
  const navigate = useNavigate();

  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseDate, setNewExpenseDate] = useState("");
  const [newExpenseSources, setNewExpenseSources] = useState([]);
  const [sourceAmounts, setSourceAmounts] = useState({});
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [isTodayChecked, setIsTodayChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sourceCategory, setSourceCategory] = useState(null); //type*s*
  const [allowMultipleSources, setAllowMultipleSources] = useState(false);

  const fakeCurrency = "€";

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      const [createExpenseResult, payExpenseResult] = await Promise.all([
        createExpense(
          Number(newExpenseAmount),
          newExpenseDate,
          newExpenseSources,
          newExpenseDescription,
          false, // isLockedIn
          setExpenses,
        ),
        payExpense(newExpenseAmount, newExpenseSources, sourceAmounts, envelopes, savings),
      ]);

      if (!createExpenseResult.success) {
        console.log(`Error creating expense: ${createExpenseResult.error}`);
        // fail message
        return;
      }
      if (!payExpenseResult.success) {
        console.log(`Error paying expense: ${payExpenseResult.error}`);
        // fail message
        return;
      }
      // if both operations succeeded
      console.log("Expense created and paid successfully!");
      // success message
      setNewExpenseAmount("");
      setNewExpenseSources([]);
      setNewExpenseDescription("");
      setSourceCategory(null);
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
    // Replace comma with dot before checking the value
    value = value.replace(/,/g, ".");
    const regex = /^(|0|0\.|0\.\d{1,2}|[1-9]\d*(\.|\.\d{1,2})?)$/;
    if (regex.test(value)) {
      setValue(value);
    }
  };

  const handleTodayCheckboxChange = (event) => {
    setIsTodayChecked(event.target.checked);
    setNewExpenseDate(event.target.checked ? date : "");
  };

  const handleSourcesCheckboxChange = (event) => {
    setAllowMultipleSources(event.target.checked);
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
    setNewExpenseSources([]);
    setSourceCategory(null);
  }, [allowMultipleSources]);

  useEffect(() => {
    if (newExpenseDate === date) {
      setIsTodayChecked(true);
    }
  }, [newExpenseDate, date]);

  useEffect(() => {
    setIsDisabled(
      newExpenseAmount === "" ||
        newExpenseAmount === "0" ||
        newExpenseDate === "" ||
        newExpenseSources.length === 0,
    );
  }, [newExpenseAmount, newExpenseDate, newExpenseSources]);

  return (
    <div className="new-expense-page">
      <div className="new-expense-page__nav-back">
        <Button
          type="button"
          className="button"
          onClick={() => navigate("/envelopes")}
          variant="back"
          isDisabled={false}
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
          <label className="form-item__label" htmlFor="amount">
            Amount
          </label>
          <div className="form-item__input-with-currency">
            <span className="form-item__input-with-currency__currency">
              {fakeCurrency}
            </span>
            <input
              className="form-item__input-with-currency__input"
              type="text"
              value={newExpenseAmount}
              onChange={(e) => handleValueChange(e, setNewExpenseAmount)}
              id="amount"
              name="amount"
            />
          </div>
        </div>

        <div className="form-item">
          <label className="form-item__label" htmlFor="date">
            Date
          </label>
          <div className="form-item__date">
            <input
              className="form-item__date__input"
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
          <label className="form-item__label" htmlFor="sources">
            Sources
          </label>
          {loadingData ? (
            <p>Loading data...</p>
          ) : (
            <>
              <input
                type="checkbox"
                id="sources"
                checked={allowMultipleSources}
                onChange={handleSourcesCheckboxChange}
              />
              <label>Choose multiple sources?</label>
              {allowMultipleSources ? (
                <SourceCheckboxRaw
                  newExpenseAmount={newExpenseAmount}
                  newExpenseSources={newExpenseSources}
                  sourceAmounts={sourceAmounts}
                  setSourceAmounts={setSourceAmounts}
                  setNewExpenseSources={setNewExpenseSources}
                  envelopes={envelopes}
                  savings={savings}
                />
              ) : (
                <SourceSelectRaw
                  newExpenseAmount={newExpenseAmount}
                  setNewExpenseSources={setNewExpenseSources}
                  sourceCategory={sourceCategory}
                  setSourceCategory={setSourceCategory}
                  envelopes={envelopes}
                  savings={savings}
                  loadingData={loadingData}
                />
              )}
            </>
          )}
        </div>

        <div className="form-item">
          <label className="form-item__label" htmlFor="description">
            Description (optional)
          </label>
          <input
            className="form-item__input"
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
            className="button"
            onClick={null}
            variant="green"
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
