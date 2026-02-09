import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import logo from "../assets/logo.png";
import "./Header.css";

function AdminHeader({
  title = "관리자 대시보드",
  onMenuClick = () => {},
  pendingCount = 0,
}) {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="main-header">
      <div className="header-glow" />
      <div className="header-inner">

        {/* 좌측 */}
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

          <div className="header-page">{title}</div>

          <div className="admin-btn-group">
            <button
              type="button"
              className="admin-btn admin-list"
              onClick={() => navigate("/admin/wastes")}
            >
              📋 접수 목록
              {pendingCount > 0 && (
                <span className="badge">{pendingCount}</span>
              )}
            </button>

            <button
              type="button"
              className="admin-btn admin-logout"
              onClick={handleLogout}
            >
              🚪 로그아웃
            </button>
          </div>
        </div>

        {/* 중앙 */}
        <div className="header-slogan admin">
          관리자 모드
        </div>

        {/* 우측 */}
        <button type="button" className="menu-btn" onClick={onMenuClick}>
          <span />
          <span />
          <span />
        </button>

      </div>
    </header>
  );
}

export default AdminHeader;
