import React, { useRef } from "react";
import { useRoughTableBorders } from "../../../hooks/useRoughBorders";
import SvgEnvelopeStack from "../../dynamic-icons/SvgEnvelopeStack";
import useCSSVariable from "../../../hooks/useCSSVariable";
import useScreenSize from "../../../hooks/useScreenSize";

const ExpensesTable = ({ expenses }) => {
  const fakeCurrency = "€";
  const tableRef = useRef(null);
  const svgRef = useRef(null);
  const { screenWidth } = useScreenSize();
  const backgroundColor = useCSSVariable("--background-color");

  useRoughTableBorders(tableRef, svgRef, [expenses]);

  return (
    <div className="expenses-table">
      <svg ref={svgRef} className="expenses-table__svg"></svg>
      <table ref={tableRef} className="expenses-table__table">
        <thead className="expenses-table__table__head">
          <tr className="expenses-table__table__row">
            {screenWidth < 600 ? (
              <>
                <th className="expenses-table__table__header expenses-table__table__header--icons">
                  <svg width="32" height="32">
                    <use href="#calendar" />
                  </svg>
                </th>
                <th className="expenses-table__table__header expenses-table__table__header--icons">
                  <svg width="32" height="32">
                    <use href="#money-bag" />
                  </svg>
                </th>
                <th className="expenses-table__table__header expenses-table__table__header--icons">
                  <SvgEnvelopeStack
                    width={32}
                    backgroundColor={backgroundColor}
                  />
                </th>
                <th className="expenses-table__table__header expenses-table__table__header--icons">
                  <svg width="32" height="32">
                    <use href="#invoice" />
                  </svg>
                </th>
                <th className="expenses-table__table__header expenses-table__table__header--icons">
                  <svg width="32" height="32">
                    <use href="#square-lock" />
                  </svg>
                </th>
              </>
            ) : (
              <>
                <th className="expenses-table__table__header">Date</th>
                <th className="expenses-table__table__header">Amount</th>
                <th className="expenses-table__table__header">Sources</th>
                <th className="expenses-table__table__header">Description</th>
                <th className="expenses-table__table__header">Locked in</th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="expenses-table__table__body">
          {expenses.map((expense) => {
            const day = Number(expense.date.slice(8));
            const suffix = ["st", "nd", "rd", "th"][
              day % 10 === 1 && day !== 11
                ? 0
                : day % 10 === 2 && day !== 12
                  ? 1
                  : day % 10 === 3 && day !== 13
                    ? 2
                    : 3
            ];

            return (
              <tr key={expense.id} className="expenses-table__table__row">
                <td
                  className="expenses-table__table__cell"
                  style={{ wordBreak: "normal" }}
                >
                  {day}
                  {suffix}
                </td>
                <td
                  className="expenses-table__table__cell"
                  style={{ wordBreak: "normal" }}
                >
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesTable;
