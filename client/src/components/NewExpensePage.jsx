import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { createExpense } from "../util/axios/createFunctions";
import { payExpense } from "../util/payExpense";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import backArrow from "../media/back-arrow.png";

const NewExpensePage = () => {
  const { setExpenses, envelopes, savings, loadingData, date } =
    useOutletContext();
  const navigate = useNavigate();

  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseDate, setNewExpenseDate] = useState("");
  const [newExpenseSource, setNewExpenseSource] = useState("");
  const [newExpenseDescription, setNewExpenseDescription] = useState("");
  const [isTodayChecked, setIsTodayChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const [sourceType, setSourceType] = useState(null);

  const fakeCurrency = "€";

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    try {
      const [createExpenseResult, payExpenseResult] = await Promise.all([
        createExpense(
          Number(newExpenseAmount),
          newExpenseDate,
          newExpenseSource,
          newExpenseDescription,
          false, // isLockedIn
          setExpenses,
        ),
        payExpense(newExpenseAmount, newExpenseSource, envelopes, savings),
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
      setNewExpenseSource("");
      setNewExpenseDescription("");
      setSourceType(null);
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

  const handleCheckboxChange = (event) => {
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

  useEffect(() => {
    setIsDisabled(
      newExpenseAmount === "" ||
        newExpenseAmount === "0" ||
        newExpenseDate === "" ||
        newExpenseSource === "",
    );
  }, [newExpenseAmount, newExpenseDate, newExpenseSource]);

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
        Add a new expense and choose the source to pay from.
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
              onChange={handleCheckboxChange}
            />
            <label className="checkbox-label" htmlFor="today">
              Today
            </label>
          </div>
        </div>

        <div className="form-item">
          {/*
            Deliberately not styling this section.
            Will replace with custom components.
            This will remain somewhere for accessibility purposes.
          */}
          <fieldset className="source-type-fieldset">
            <legend className="source-type-fieldset__legend">Source</legend>
            <input
              className="form-item__input--radio"
              type="radio"
              value="envelope"
              id="envelope"
              name="source-type"
              checked={sourceType === "envelope"}
              onChange={() => {
                setNewExpenseSource("");
                setSourceType("envelope");
              }}
            />
            <label htmlFor="envelope">Envelope</label>
            <input
              className="form-item__input--radio"
              type="radio"
              value="savings"
              id="savings"
              name="source-type"
              checked={sourceType === "savings"}
              onChange={() => {
                setNewExpenseSource("savings");
                setSourceType("savings");
              }}
            />
            <label htmlFor="savings">Savings</label>
          </fieldset>

          {/* Render if "envelope" source is chosen */}
          {sourceType === "envelope" && (
            <div className="expense-envelope">
              <label htmlFor="envelope-select"></label>
              <select
                className="expense-envelope__select"
                name="envelope-select"
                id="envelope-select"
                onChange={(e) => setNewExpenseSource(e.target.value)}
              >
                {loadingData ? (
                  <option
                    className="expense-envelope__select__loading-message"
                    value=""
                  >
                    Loading your envelopes...
                  </option>
                ) : envelopes.length === 0 ? (
                  <option
                    className="expense-envelope__select__no-options-message"
                    value=""
                  >
                    No envelopes to select from.
                  </option>
                ) : (
                  <>
                    <option key="-1" value="">
                      Select an envelope
                    </option>
                    {envelopes.map((envelope) => (
                      <option
                        key={envelope.id}
                        value={envelope.id}
                        disabled={envelope.currentAmount === 0}
                      >
                        {envelope.name} ({fakeCurrency}
                        {envelope.currentAmount} left)
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
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
