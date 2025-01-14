import React, { useState, useEffect } from "react";
import { fetchEnvelopes } from "../util/axios/fetchEnvelopes";
import { fetchTotalBudget } from "../util/axios/fetchTotalBudget";
import { calcUnassignedBudget } from "../util/calcUnassignedBudget";
import { Outlet, useLocation } from "react-router-dom";
import "../sass/main.scss";
import Navigation from "./Navigation";

const App = () => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [envelopes, setEnvelopes] = useState([]);
  const [unassignedBudget, setUnassignedBudget] = useState(0);
  const [loadingEnvelopes, setLoadingEnvelopes] = useState(true);
  const [date, setDate] = useState(new Date());

  const appData = {
    envelopes,
    setEnvelopes,
    totalBudget,
    setTotalBudget,
    unassignedBudget,
    loadingEnvelopes,
    date,
  };

  const location = useLocation();
  const navRoutes = ["/home", "/envelopes", "/goals"];
  const isNavRoute = navRoutes.includes(location.pathname);

  // Fetch data on load
  useEffect(() => {
    setDate(new Date());

    const loadStuff = async () => {
      try {
        const fetchedEnvelopes = await fetchEnvelopes();
        setLoadingEnvelopes(false);
        setEnvelopes(fetchedEnvelopes);
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
      {isNavRoute && <Navigation />}
      <div className="app__outlet">
        <Outlet context={appData} />
      </div>
    </div>
  );
};

export default App;
