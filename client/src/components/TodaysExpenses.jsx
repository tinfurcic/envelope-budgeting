import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "./Button";

const TodaysExpenses = () => {
  const { expenses, loadingExpenses, syncingExpenses, date } =
    useOutletContext();

  const fakeCurrency = "€";

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
          type="button"
          className="button"
          onClick={null}
          variant="blue"
          isDisabled={false}
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
          <table className="todays-expenses__table">
            <thead className="todays-expenses__table-head">
              <tr>
                <th>Amount</th>
                <th>Paid from</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody className="todays-expenses__table-body">
              {todaysExpenses.map((expense/*, index*/) => (
                <tr key={expense.id} /*className={`todays-expenses__row-${index}`}*/>
                  <td className="todays-expenses__amount-cell">
                    {fakeCurrency}
                    {expense.amount}
                  </td>
                  <td className="todays-expenses__sources-cell">
                    {expense.sources.map((source) => (source.name)).join(", ")}
                  </td>
                  <td className="todays-expenses__description-cell">{expense.description || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TodaysExpenses;
