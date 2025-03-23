import React from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import ExpensesTable from "./ExpensesTable";
import Button from "./Button";
import MonthNavigation from "./MonthNavigation";

const Expenses = () => {
  const { expenses, date } = useOutletContext();
  const { yearMonth } = useParams(); // Get the current month from the route
  const navigate = useNavigate();

  const [year, month] = yearMonth.split("-").map(Number);

  // old expenses will probably be retrieved from expensesHistory, but some may need filtering
  const expensesThisMonth = expenses.filter(
    (expense) =>
      expense.date.slice(0, 7) === `${year}-${String(month).padStart(2, "0")}`,
  );

  return (
    <div className="expenses">
      <Button className="button button--back-arrow" onClick={() => navigate("/home")}>
        <span className="button--back-arrow__arrow">{"<---"}</span>
        <span className="button--back-arrow__text">Home</span>
      </Button>
      <h1 className="expenses__heading">All expenses</h1>
      <MonthNavigation year={year} month={month} currentDate={date} />
      <div className="expenses__sort-toolbar">

      </div>
      {expensesThisMonth?.length > 0 ?
        <ExpensesTable expenses={expensesThisMonth} /> :
        <p>No expenses this month.</p>
      }
    </div>
  );
};

export default Expenses;
