import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../profile/Login";
import App from "../App";
import Home from "../home/Home";
import CreateEnvelopePage from "../envelopes/CreateEnvelopePage";
import CreateExpensePage from "../expenses/CreateExpensePage";
import CreateGoalPage from "../goals/CreateGoalPage";
import EnvelopesPage from "../envelopes/EnvelopesPage";
import GoalsPage from "../goals/GoalsPage";
import Envelope from "../envelopes/Envelope";
import Goal from "../goals/Goal";
import ProfilePage from "../profile/ProfilePage";
import Expenses from "../expenses/Expenses";

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
