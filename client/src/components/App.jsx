import React, { useState, useEffect } from "react";
import { fetchAllData } from "../util/fetchAllData";
import { calcTotalBudget } from "../util/calcTotalBudget";
import { calcTotalCurrentAmount } from "../util/calcTotalCurrentAmount";
import { Outlet } from "react-router-dom";
import "../sass/main.scss";
import ResponsiveLayout from "./layout/ResponsiveLayout";

const App = () => {
  const [envelopes, setEnvelopes] = useState(null);
  const [goals, setGoals] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [income, setIncome] = useState(null);
  const [savings, setSavings] = useState(null);
  const [settings, setSettings] = useState(null);

  const [totalIncome, setTotalIncome] = useState(null);
  const [totalBudget, setTotalBudget] = useState(null);
  const [totalCurrentAmount, setTotalCurrentAmount] = useState(null);

  const [loadingData, setLoadingData] = useState(true);
  const [date, setDate] = useState(new Date());

  const appData = {
    envelopes,
    setEnvelopes,
    goals,
    setGoals,
    expenses,
    setExpenses,
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
  };

  // Fetch data on load
  useEffect(() => {
    setDate(new Date());

    const fetchDataOnLoad = async () => {
      try {
        const data = await fetchAllData();
        setEnvelopes(data.envelopes);
        setGoals(data.goals);
        setExpenses(data.expenses);
        setIncome(data.income);
        setSavings(data.savings);
        setSettings(data.settings);
        setLoadingData(false);
      } catch (error) {
        console.error("Unable to load data properly.", error);
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
