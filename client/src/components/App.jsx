import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "../sass/main.scss";
import useEnvelopesListener from "../hooks/useEnvelopesListener";
import useExpensesListener from "../hooks/useExpensesListener";
import useGoalsListener from "../hooks/useGoalsListener";
import useSavingsListener from "../hooks/useSavingsListener";
import useIncomeListener from "../hooks/useIncomeListener";
import useSettingsListener from "../hooks/useSettingsListener";
import ResponsiveLayout from "./layout/ResponsiveLayout";

const App = () => {
  const { envelopes, nextEnvelopeId, budgetSum, loadingEnvelopes, syncingEnvelopes } =
    useEnvelopesListener();
  const { expenses, nextExpenseId, loadingExpenses, syncingExpenses } =
    useExpensesListener();
  const { goals, nextGoalId, loadingGoals, syncingGoals } = useGoalsListener();
  const { savings, loadingSavings, syncingSavings } = useSavingsListener();
  const { income, loadingIncome, syncingIncome } = useIncomeListener();
  const { settings, loadingSettings, syncingSettings } = useSettingsListener();

  const [totalIncome, setTotalIncome] = useState(null);

  const [date, setDate] = useState(getTodayDate());
  const [fullDate, setFullDate] = useState(new Date());

  function getTodayDate() {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }

  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();

    const timer = setTimeout(() => {
      setDate(getTodayDate()); // Update today's date at midnight
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [date]);

  const appData = {
    envelopes,
    nextEnvelopeId,
    expenses,
    nextExpenseId,
    budgetSum,
    goals,
    nextGoalId,
    income,
    savings,
    settings,
    totalIncome,
    setTotalIncome,
    loadingEnvelopes,
    syncingEnvelopes,
    loadingExpenses,
    syncingExpenses,
    loadingGoals,
    syncingGoals,
    loadingSavings,
    syncingSavings,
    loadingIncome,
    syncingIncome,
    loadingSettings,
    syncingSettings,
    date,
    fullDate,
  };

  useEffect(() => {
    if (income !== null) {
      setTotalIncome(income.extraIncome + income.regularIncome);
    }
  }, [income]);

  return (
    <div className="app">
      <ResponsiveLayout>
        <div className="app__outlet">
          <Outlet context={appData} />
        </div>
      </ResponsiveLayout>
    </div>
  );
};

export default App;
