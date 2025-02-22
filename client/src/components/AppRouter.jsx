import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import App from "./App";
import Home from "./Home";
import EnvelopesPage from "./EnvelopesPage";
import GoalsPage from "./GoalsPage";
import ProfilePage from "./ProfilePage";
import CreateEnvelopePage from "./CreateEnvelopePage";
import CreateExpensePage from "./CreateExpensePage";
import CreateGoalPage from "./CreateGoalPage";
import Envelope from "./Envelope";

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
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/create-envelope" element={<CreateEnvelopePage />} />
        <Route path="/create-goal" element={<CreateGoalPage />} />
        <Route path="/expense" element={<CreateExpensePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
