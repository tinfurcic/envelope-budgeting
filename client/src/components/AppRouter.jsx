import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import EnvelopesPage from "./EnvelopesPage";
import GoalsPage from "./GoalsPage";
import CreateEnvelopePage from "./CreateEnvelopePage";
import ManageFundsPage from "./ManageFundsPage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
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
        <Route path="/create" element={<CreateEnvelopePage />} />
        <Route path="/funds" element={<ManageFundsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
