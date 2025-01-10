import React, { useState, useEffect } from "react";
import { changeBudget } from "../util/axios/changeBudget";
import { fetchTotalBudget } from "../util/axios/fetchTotalBudget";

const AmountField = ({ label, amount, setAmount, id, showSaveButton }) => {
  const [inputValue, setInputValue] = useState(amount?.toString() || "");
  // The fact that inputValue isn't clearing after submission doesn't matter! Ultimately, the whole dialogue window will be closed.

  useEffect(() => {
    // this is a bit slower than drawing from `amount`, but at least we can modify `amount` without going to an infinite loop
    if (id === -1) {
      const loadTotalBudget = async () => {
        const budget = await fetchTotalBudget();
        setInputValue(budget.toString());
      };
      loadTotalBudget();
    }
  }, [id]);

  useEffect(() => {
    if (showSaveButton === false) {
      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue)) {
        setAmount(parsedValue);
      }
    }
  }, [inputValue, setAmount, showSaveButton]);

  const handleChange = (event) => {
    const value = event.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setInputValue(value);
    }
  };

  const saveChanges = async () => {
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      const result = await changeBudget(parsedValue, setAmount, id);
      if (!result.success) {
        console.error("Failed to update budget:", result.error);
      } else {
        console.log("Budget updated successfully:", result.data);
      }
    } else {
      console.error("Invalid amount entered");
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter amount"
      />
      {showSaveButton ? <button onClick={saveChanges}>Save</button> : null}
    </div>
  );
};

export default AmountField;
