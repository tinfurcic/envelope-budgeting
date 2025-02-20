import React from "react";

const ExpensesTable = ({ dateWindow, expenses, envelope }) => {
  const fakeCurrency = "€";

  return (
    <table className="expenses-table">
      <thead className="expenses-table__head">
        <tr className="expenses-table__row">
          <th className="expenses-table__header">Amount</th>
          <th className="expenses-table__header">Description</th>
          <th className="expenses-table__header">
            {dateWindow === "today"
              ? "Paid from"
              : dateWindow === "latest"
                ? "Date"
                : ""}
          </th>
        </tr>
      </thead>
      <tbody className="expenses-table__body">
        {expenses.map((expense) => {
          const amount =
            dateWindow === "today"
              ? expense.amount
              : dateWindow === "latest"
                ? expense.sources.find((source) => source.id === envelope.id)
                    ?.amount
                : null;

          const sourceNames =
            dateWindow === "today"
              ? expense.sources.map((source) => source.name).join(", ")
              : dateWindow === "latest"
                ? expense.date
                : null;

          return (
            <tr key={expense.id} className="expenses-table__row">
              <td className="expenses-table__cell">
                {amount !== null && (
                  <>
                    {fakeCurrency}
                    {amount}
                  </>
                )}
              </td>
              <td className="expenses-table__cell">
                {expense.description || "N/A"}
              </td>
              <td className="expenses-table__cell">{sourceNames}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ExpensesTable;
