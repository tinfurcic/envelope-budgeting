import React, { useRef } from "react";
import { useRoughTableBorders } from "../hooks/useRoughBorders";
import SvgEnvelopeStack from "./svg-icons/SvgEnvelopeStack";
import SvgCoins from "./svg-icons/SvgMoneyBag";
import SvgCalendar from "./svg-icons/SvgCalendar";
import SvgReceipt from "./svg-icons/SvgReceipt";
import SvgLocked from "./svg-icons/SvgLocked";

const ExpensesTable = ({ expenses }) => {
  const fakeCurrency = "€";
  const tableRef = useRef(null);
  const svgRef = useRef(null);

  useRoughTableBorders(tableRef, svgRef, [expenses]);

  return (
    <div className="expenses-table">
      <svg ref={svgRef} className="expenses-table__svg"></svg>
      <table ref={tableRef} className="expenses-table__table">
        <thead className="expenses-table__table__head">
          <tr className="expenses-table__table__row">
            <th className="expenses-table__table__header">
              <SvgCalendar />
            </th>
            <th className="expenses-table__table__header">
              <SvgCoins />
            </th>
            <th className="expenses-table__table__header">
              <SvgEnvelopeStack />
            </th>
            <th className="expenses-table__table__header">
              <SvgReceipt />
            </th>
            <th className="expenses-table__table__header">
              <SvgLocked />
            </th>
          </tr>
        </thead>
        <tbody className="expenses-table__table__body">
          {expenses.map((expense) => (
            <tr key={expense.id} className="expenses-table__table__row">
              <td className="expenses-table__table__cell">
                {expense.date.slice(8)}.
              </td>
              <td className="expenses-table__table__cell">
                {fakeCurrency}
                {expense.amount}
              </td>
              <td className="expenses-table__table__cell">
                {expense.sources.map((source) => source.name).join(", ")}
              </td>
              <td className="expenses-table__table__cell">
                {expense.description}
              </td>

              <td className="expenses-table__table__cell">
                {expense.isLockedIn ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
