import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ClientLayout from "./layouts/ClientLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

import CategorySelect from "./pages/CategorySelect";
import CompanyIntro from "./pages/Company/CompanyIntro";
import ResultA from "./pages/ResultA";
import ResultB from "./pages/ResultB";
import ResultC from "./pages/ResultC";
import PrivacyPolicy from "./pages/PrivacyPolicy";

import AdminHome from "./pages/admin/AdminHome";
import AdminWastes from "./pages/admin/AdminWastes";
import AdminWasteDetail from "./pages/admin/AdminWasteDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminMailLogs from "./pages/admin/AdminMailLogs";
import SalesSummary from "./pages/admin/SalesSummary";

function App() {
  return (
    <Routes>

      {/* 고객 영역 */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<CategorySelect />} />
        <Route path="company" element={<CompanyIntro />} />
        <Route path="resultA" element={<ResultA />} />
        <Route path="resultB" element={<ResultB />} />
        <Route path="resultC" element={<ResultC />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
      </Route>

      {/* 관리자 로그인 */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* 관리자 영역 */}
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="wastes" element={<AdminWastes />} />
        <Route path="wastes/:id" element={<AdminWasteDetail />} />
        <Route path="mail-logs" element={<AdminMailLogs />} />
      </Route>

      {/* 매출 집계 - 독립 주소 /income */}
      <Route
        path="/income"
        element={
          <AdminProtectedRoute>
            <SalesSummary />
          </AdminProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;