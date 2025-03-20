import React, { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import Button from "./Button";
import SimpleExpensesTable from "./SimpleExpensesTable";

const TodaysExpenses = () => {
  const navigate = useNavigate();
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
        <Button
          className="button button--blue"
          onClick={() => navigate(`/expenses/${date.slice(0, 7)}`)}
          //onTouchEnd={() => navigate(`/expenses/${date.slice(0, 7)}`)}
        >
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
          <SimpleExpensesTable dateWindow="today" expenses={todaysExpenses} />
        )}
      </div>
    </div>
  );
};

export default TodaysExpenses;
