import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import BudgetManager from "./BudgetManager";
import SavingsManager from "./SavingsManager";
import GoalsManager from "./GoalsManager";
import CreateEnvelope from "./CreateEnvelope";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/" element={<App />}>
        <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute> <CreateEnvelope /> </PrivateRoute>} />
        <Route path="/budget" element={<PrivateRoute> <BudgetManager /> </PrivateRoute>} />
        <Route path="/savings" element={<PrivateRoute> <SavingsManager /> </PrivateRoute>} />
        <Route path="/goals" element={<PrivateRoute> <GoalsManager /> </PrivateRoute>} />
      </Route>
      <Route path="/login" element={<Login />} />
      
    </Routes>
  );
}

export default AppRouter;
