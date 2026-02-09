import "../pages/admin/Admin.css";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import AdminHeader from "../components/AdminHeader";

function AdminLayout() {
  const { loading, logout } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>관리자 로딩중...</div>;
  }

  return (
    <>
      <AdminHeader
        pageTitle="관리자 대시보드"
        onLogout={() => {
          logout();
          navigate("/", { replace: true });
        }}
      />

      <main className="admin-main">
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;
