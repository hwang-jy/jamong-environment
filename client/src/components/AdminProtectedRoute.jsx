import React from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminProtectedRoute({ children }) {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) return <div>인증 확인중...</div>;

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminProtectedRoute;
