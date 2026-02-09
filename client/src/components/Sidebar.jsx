import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext"; // ⭐ 추가
import bizLicense from "../assets/biz_licens.png";
import "./Sidebar.css";

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAdminAuth(); // ⭐ 여기서 선언

  const isAdminPage = location.pathname.startsWith("/admin");

  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <aside className="sidebar open">
        {/* 회사 정보 */}
        <ul className="info-list">
          <li><strong>대표:</strong> 김진태</li>
          <li><strong>등록번호:</strong> 831-44-01047</li>
          <li><strong>업종:</strong> 쓰레기 분리수거 대행</li>
          <li><strong>설립일:</strong> 2024-05-24</li>
        </ul>

        <blockquote className="brand-philosophy">
          “깨끗함과 조화를 통해 고객과 환경이 함께 웃는 세상”
        </blockquote>

        <div className="license-box">
          <img src={bizLicense} alt="사업자등록증" />
        </div>

        <hr />

      {isAdmin && isAdminPage && (
        <button
          onClick={() => {
            navigate("/admin");
            onClose();
          }}
        >
          사업자 관리
        </button>
      )}

        <button
          onClick={() => {
            navigate("/company");
            onClose();
          }}
        >
          회사 소개
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
