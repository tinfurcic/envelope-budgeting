import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "./Button";
import ExpensesTable from "./ExpensesTable";

const TodaysExpenses = () => {
  const { expenses, loadingExpenses, syncingExpenses, date } =
    useOutletContext();

  const [todaysExpenses, setTodaysExpenses] = useState(null);

  useEffect(() => {
    if (expenses) {
      setTodaysExpenses(expenses.filter((expense) => expense.date === date));
    }
  }, [expenses, date]);

  return (
    <div className="todays-expenses">
      <div className="todays-expenses__header">
        <h2 className="todays-expenses__heading">Today's expenses</h2>
        <Button className="button button--blue" onClick={null}>
          All expenses
        </Button>
      </div>

      <div className="todays-expenses__expenses">
        {loadingExpenses || todaysExpenses === null ? (
          <p>Loading expenses...</p>
        ) : syncingExpenses ? (
          <p>Syncing expenses...</p>
        ) : todaysExpenses.length === 0 ? (
          <p>No expenses today.</p>
        ) : (
          <ExpensesTable dateWindow="today" expenses={todaysExpenses} />
        )}
      </div>
    </div>
  );
};

export default TodaysExpenses;
