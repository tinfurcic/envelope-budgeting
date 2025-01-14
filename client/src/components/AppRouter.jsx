import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import EnvelopesPage from "./EnvelopesPage";
import GoalsPage from "./GoalsPage";
import CreateEnvelope from "./CreateEnvelope";
import ManageFundsPage from "./ManageFundsPage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

function AppRouter() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

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
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/create" element={<CreateEnvelope />} />
        <Route path="/funds" element={<ManageFundsPage />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/home" />} />
    </Routes>
  );
}

export default AppRouter;
