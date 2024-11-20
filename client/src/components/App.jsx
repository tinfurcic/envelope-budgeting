import React, { useState, useEffect } from "react";
import { fetchEnvelopes } from "../util/fetchEnvelopes";
import { fetchTotalBudget } from "../util/fetchTotalBudget";
import { calcUnassignedBudget } from "../util/calcUnassignedBudget";
import Navigation from "./Navigation";
import { Outlet } from "react-router-dom";
import "../sass/main.scss";

const App = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [envelopes, setEnvelopes] = useState([]);
  const [shortTermSavings, setShortTermSavings] = useState(200);
  const [unassignedBudget, setUnassignedBudget] = useState(0);
  const appData = { envelopes, setEnvelopes, totalBudget, setTotalBudget };

  // Fetch data on load
  useEffect(() => {
    const loadStuff = async () => {
      try {
        const fetchedEnvelopes = await fetchEnvelopes();
        setEnvelopes(fetchedEnvelopes);
        console.log(fetchedEnvelopes);
        const fetchedTotalBudget = await fetchTotalBudget();
        setTotalBudget(fetchedTotalBudget);
      } catch (error) {
        console.error("Unable to load stuff properly.", error);
      }
    };
    loadStuff();
  }, []);

  useEffect(() => {
    setUnassignedBudget(calcUnassignedBudget(envelopes, totalBudget));
  }, [totalBudget, envelopes]);

  return (
    <div className="app">
      <header className="app__header">
        <Navigation />
      </header>
      <main className="app__main">
        <Outlet context={appData} />
      </main>
    </div>
  );
};

export default App;
