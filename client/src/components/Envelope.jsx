import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import ExpensesTable from "./ExpensesTable";

const Envelope = () => {
  const { id } = useParams();
  const { envelopes, expenses, loadingExpenses, syncingExpenses } =
    useOutletContext();
  const navigate = useNavigate();

  const envelope = envelopes.find((env) => env.id.toString() === id);

  const [latestExpenses, setLatestExpenses] = useState(null);

  useEffect(() => {
    if (expenses) {
      setLatestExpenses(
        expenses.filter((expense) =>
          expense.sources.some((source) => source.id === envelope.id),
        ),
      );
    }
  }, [expenses, envelope]);

  if (!envelope) {
    return <span>Envelope not found.</span>;
  }

  return (
    <div className="envelope-overview">
      <header
        className="envelope-overview__header"
        style={{ "--envelope-color": envelope.color }}
      >
        <button
          type="button"
          className="envelope-overview__back-button"
          onClick={() => navigate("/envelopes")}
        >
          X
        </button>
        <h1 className="envelope-overview__name">{envelope.name}</h1>
        <p className="envelope-overview__description">
          {envelope.description || "No description"}
        </p>
      </header>
      <main>
        <div className="envelope-overview__overview">
          <h2 className="envelope-overview__subheading">Budget overview</h2>
          <ProgressBar
            budget={envelope.budget}
            amount={envelope.currentAmount}
          />
        </div>
        <div className="envelope-overview__latest-expenses">
          <h2 className="envelope-overview__subheading">Latest expenses</h2>
          {loadingExpenses || latestExpenses === null ? (
            <p>Loading expenses...</p>
          ) : syncingExpenses ? (
            <p>Syncing expenses...</p>
          ) : latestExpenses.length === 0 ? (
            <p>No expenses this month.</p>
          ) : (
            <ExpensesTable
              dateWindow="latest"
              expenses={latestExpenses}
              envelope={envelope}
            />
          )}
        </div>

        <h2 className="envelope-overview__subheading">This month's expenses</h2>
      </main>
    </div>
  );
};

export default Envelope;
