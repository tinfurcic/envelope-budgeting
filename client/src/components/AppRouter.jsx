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
      <Route
        path="/"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateEnvelope />} />
        <Route path="/budget" element={<BudgetManager />} />
        <Route path="/savings" element={<SavingsManager />} />
        <Route path="/goals" element={<GoalsManager />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default AppRouter;
