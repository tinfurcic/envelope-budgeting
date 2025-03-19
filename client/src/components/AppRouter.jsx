import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import App from "./App";
import Home from "./Home";
import CreateEnvelopePage from "./CreateEnvelopePage";
import CreateExpensePage from "./CreateExpensePage";
import CreateGoalPage from "./CreateGoalPage";
import EnvelopesPage from "./EnvelopesPage";
import GoalsPage from "./GoalsPage";
import Envelope from "./Envelope";
import Goal from "./Goal";
import ProfilePage from "./ProfilePage";
import Expenses from "./Expenses";

function AppRouter() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Private Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        }
      >
        {/* Main content routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/envelopes" element={<EnvelopesPage />} />
        <Route path="/envelopes/:id" element={<Envelope />} />
        <Route path="/create-envelope" element={<CreateEnvelopePage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/goals/:id" element={<Goal />} />
        <Route path="/create-goal" element={<CreateGoalPage />} />
        <Route path="/create-expense" element={<CreateExpensePage />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/:yearMonth" element={<Expenses />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
