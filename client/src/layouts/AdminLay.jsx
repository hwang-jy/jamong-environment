// src/layouts/AdminLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

import AdminHeader from "../components/AdminHeader";
import AdminLogin from "../pages/admin/AdminLogin";
import "../pages/admin/Admin.css";

function AdminLayout() {
  const { isAdmin, loading, logout } = useAdminAuth();
  const navigate = useNavigate();

  // ✅ 로딩 중일 때는 아무것도 렌더하지 않음
  
  if (loading) {
  return <div>관리자 로딩중...</div>;
}


  // ❌ 로그인 안 됨 → 로그인 화면
  if (!isAdmin) {
    return (
      <div className="admin-bg">
        <AdminLogin />
      </div>
    );
  }

  // ✅ 로그인 됨 → 관리자 화면
  return (
    <>
      <AdminHeader
        pageTitle="관리자 대시보드"
        isAdmin={true}
        onLogout={() => {
          logout();
          navigate("/", { replace: true });
        }}
      />

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </>
  );
}

export default AdminLayout;
