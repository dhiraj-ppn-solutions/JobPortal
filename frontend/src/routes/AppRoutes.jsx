import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminDashboard from "../pages/admin/Dashboard";
import UserDashboard from "../pages/user/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root path to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;