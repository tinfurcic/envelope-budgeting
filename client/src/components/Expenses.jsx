import React from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import SvgArrowLeft from "./svg-icons/SvgArrowLeft";
import SvgArrowRight from "./svg-icons/SvgArrowRight";
import ExpensesTable from "./ExpensesTable";
import Button from "./Button";

const Expenses = () => {
  const { expenses, date } = useOutletContext();
  const { yearMonth } = useParams(); // Get the current month from the route
  const navigate = useNavigate();

  const [year, month] = yearMonth.split("-").map(Number);
  const selectedDate = new Date(year, month - 1); // JS months are 0-based

  // Format for display (e.g., "Mar 2024")
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  // old expenses will probably be retrieved from expensesHistory, but some may need filtering
  const expensesThisMonth = expenses.filter(
    (expense) =>
      expense.date.slice(0, 7) === `${year}-${String(month).padStart(2, "0")}`,
  );

  const changeMonth = (delta) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);

    const currentYearMonth = date.slice(0,7);
    const newYearMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;

    if (newYearMonth > currentYearMonth) return;
    
    navigate(`/expenses/${newYearMonth}`);
  };

  return (
    <div className="expenses">
      <h1 className="expenses__heading">All Expenses</h1>
      <nav className="expenses__navigation">
        <Button
          className="button button--month-switch"
          onClick={() => changeMonth(-1)}
        >
          <SvgArrowLeft fillColor="white" strokeColor="black" />
        </Button>
        {formattedDate}
        <Button
          className="button button--month-switch"
          onClick={() => changeMonth(1)}
        >
          <SvgArrowRight fillColor="white" strokeColor="black" />
        </Button>
      </nav>
      <ExpensesTable expenses={expensesThisMonth} />
    </div>
  );
};

export default Expenses;
