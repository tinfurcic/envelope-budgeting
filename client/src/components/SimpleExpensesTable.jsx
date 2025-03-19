import React, { useRef } from "react";
import { useRoughTableBorders } from "../hooks/useRoughBorders";

const SimpleExpensesTable = ({ dateWindow, expenses, envelope }) => {
  const fakeCurrency = "€";
  const tableRef = useRef(null);
  const svgRef = useRef(null);

  useRoughTableBorders(tableRef, svgRef, [expenses, dateWindow]);

  return (
    <div className="simple-expenses-table">
      <svg ref={svgRef} className="simple-expenses-table__svg"></svg>
      <table ref={tableRef} className="simple-expenses-table__table">
        <thead className="simple-expenses-table__table__head">
          <tr className="simple-expenses-table__table__row">
            <th className="simple-expenses-table__table__header">Amount</th>
            <th className="simple-expenses-table__table__header">
              Description
            </th>
            <th className="simple-expenses-table__table__header">
              {dateWindow === "today"
                ? "Paid from"
                : dateWindow === "latest"
                  ? "Date"
                  : ""}
            </th>
          </tr>
        </thead>
        <tbody className="simple-expenses-table__table__body">
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
              <tr
                key={expense.id}
                className="simple-expenses-table__table__row"
              >
                <td className="simple-expenses-table__table__cell">
                  {amount !== null && (
                    <>
                      {fakeCurrency}
                      {amount}
                    </>
                  )}
                </td>
                <td className="simple-expenses-table__table__cell">
                  {expense.description || "N/A"}
                </td>
                <td className="simple-expenses-table__table__cell">
                  {sourceNames}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SimpleExpensesTable;
