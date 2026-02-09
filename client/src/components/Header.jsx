// src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";

function Header({
  pageTitle = "",
  onMenuClick,
  isAdmin = false,
  onLogout,
}) {
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="header-glow" />
      <div className="header-inner">

        {/* 왼쪽 */}
        <div className="header-left">
          <div
            className="logo-area"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-glass">
              <img src={logo} alt="자몽환경 로고" />
            </div>
            <span className="brand-text">자몽환경</span>
          </div>

          {pageTitle && (
            <div className="header-page">
              {pageTitle}
            </div>
          )}

          {/* ✅ 관리자 전용 버튼 */}
          {isAdmin && (
            <div className="admin-btn-group">
              <button
                className="admin-btn admin-list"
                onClick={() => navigate("/admin/wastes")}
              >
                📋 접수 목록
              </button>

              <button
                className="admin-btn admin-logout"
                onClick={onLogout}
              >
                🚪 로그아웃
              </button>
            </div>
          )}
        </div>

        {/* 중앙 */}
        <div className="header-slogan">
          소중한 인연 정성을 다하겠습니다
        </div>

        {/* 오른쪽 */}
        {onMenuClick && (
            <button className="menu-btn" onClick={onMenuClick}>
              <span />
              <span />
              <span />
            </button>
        )}
      </div>
    </header>
  );
}

export default Header;
