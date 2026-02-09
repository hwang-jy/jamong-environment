import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function ClientLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // ⭐⭐⭐ 필수

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "견적 신청";
      case "/company":
        return "회사 소개";
      case "/resultA":
        return "생활폐기물 견적";
      case "/resultB":
        return "유품정리 견적";
      case "/resultC":
        return "사업장 견적";
      default:
        return "";
    }
  };

  return (
    <>
      <Header
        pageTitle={getPageTitle()}
        onMenuClick={() => setSidebarOpen(true)}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="app-content">
        <Outlet />
      </main>
    </>
  );
}

export default ClientLayout;
