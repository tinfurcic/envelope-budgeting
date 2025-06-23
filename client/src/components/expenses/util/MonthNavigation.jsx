import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";

const MonthNavigation = ({ year, month, currentDate }) => {
  const navigate = useNavigate();

  const selectedDate = new Date(year, month - 1); // JS months are 0-based

  // Format for display (e.g., "Mar 2024")
  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const changeMonth = (delta) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);

    const currentYearMonth = currentDate.slice(0, 7);
    const newYearMonth = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;

    if (newYearMonth > currentYearMonth) return;

    navigate(`/expenses/${newYearMonth}`);
  };

  return (
    <nav className="month-navigation">
      <Button
        className="button button--month-switch"
        onClick={() => changeMonth(-1)}
        //onTouchEnd={() => changeMonth(-1)}
      >
        <svg>
          <use href="#arrow-left-circled" />
        </svg>
      </Button>
      <div className="month-navigation__month">{formattedDate}</div>
      <Button
        className="button button--month-switch"
        onClick={() => changeMonth(1)}
        //onTouchEnd={() => changeMonth(1)}
      >
        <svg>
          <use href="#arrow-right-circled" />
        </svg>
      </Button>
    </nav>
  );
};

export default MonthNavigation;
