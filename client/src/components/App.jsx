import React, { useState, useEffect } from "react";
import { fetchAllData } from "../util/fetchAllData";
import { calcTotalBudget } from "../util/calcTotalBudget";
import { calcTotalCurrentAmount } from "../util/calcTotalCurrentAmount";
import { Outlet } from "react-router-dom";
import "../sass/main.scss";
import ResponsiveLayout from "./layout/ResponsiveLayout";

const App = () => {
  const [envelopes, setEnvelopes] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [goals, setGoals] = useState(null);
  const [income, setIncome] = useState(null);
  const [savings, setSavings] = useState(null);
  const [settings, setSettings] = useState(null);

  const [nextEnvelopeId, setNextEnvelopeId] = useState(null);
  const [nextGoalId, setNextGoalId] = useState(null);
  const [nextExpenseId, setNextExpenseId] = useState(null);

  const [totalIncome, setTotalIncome] = useState(null);
  const [totalBudget, setTotalBudget] = useState(null);
  const [totalCurrentAmount, setTotalCurrentAmount] = useState(null);

  const [loadingData, setLoadingData] = useState(true);
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
    setEnvelopes,
    nextEnvelopeId,
    expenses,
    setExpenses,
    nextExpenseId,
    goals,
    setGoals,
    nextGoalId,
    income,
    setIncome,
    savings,
    setSavings,
    settings,
    setSettings,
    totalIncome,
    setTotalIncome,
    totalBudget,
    totalCurrentAmount,
    loadingData,
    date,
    fullDate,
  };

  // Fetch data on load
  useEffect(() => {
    const fetchDataOnLoad = async () => {
      try {
        const data = await fetchAllData();
        setEnvelopes(data.envelopes);
        setExpenses(data.expenses);
        setGoals(data.goals);
        setIncome(data.income);
        setSavings(data.savings);
        setSettings(data.settings);

        setNextEnvelopeId(data.nextEnvelopeId);
        setNextGoalId(data.nextGoalId);
        setNextExpenseId(data.nextExpenseId);
      } catch (error) {
        console.error("Unable to load data properly:", error);
      } finally {
        setLoadingData(false); // Ensures loading state is updated even if there's an error
      }
    };

    fetchDataOnLoad();
  }, []);

  useEffect(() => {
    if (income !== null) {
      setTotalIncome(income.extraIncome + income.regularIncome);
    }
  }, [income]);

  useEffect(() => {
    setTotalBudget(calcTotalBudget(envelopes));
    setTotalCurrentAmount(calcTotalCurrentAmount(envelopes));
  }, [envelopes]);

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
