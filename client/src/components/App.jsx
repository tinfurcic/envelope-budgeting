import React, { useState, useEffect } from "react";
import { fetchAllData } from "../util/fetchAllData";
import { calcUnassignedBudget } from "../util/calcUnassignedBudget";
import { Outlet, useLocation } from "react-router-dom";
import "../sass/main.scss";
import Navigation from "./Navigation";

const App = () => {
  const [envelopes, setEnvelopes] = useState(null);
  const [goals, setGoals] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [income, setIncome] = useState(null);
  const [savings, setSavings] = useState(null);
  const [settings, setSettings] = useState(null);

  const [totalBudget, setTotalBudget] = useState(null);
  const [unassignedBudget, setUnassignedBudget] = useState(0);

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
    totalBudget,
    setTotalBudget,
    unassignedBudget,
    loadingData,
    date,
  };

  const location = useLocation();
  const navRoutes = ["/home", "/envelopes", "/goals", "/profile"];
  const isNavRoute = navRoutes.includes(location.pathname);

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
      setTotalBudget(income.extraIncome + income.regularIncome);
    }
  }, [income]);

  useEffect(() => {
    setUnassignedBudget(calcUnassignedBudget(envelopes, totalBudget));
  }, [totalBudget, envelopes]);

  return (
    <div className="app">
      {isNavRoute && <Navigation />}
      <div className="app__outlet">
        <Outlet context={appData} />
      </div>
    </div>
  );
};

export default App;
