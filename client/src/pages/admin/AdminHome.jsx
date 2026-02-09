import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>사업자 관리</h1>
        <p style={styles.desc}>
          사업자 정보 확인 및<br />
          접수·관리 기능을 처리하는 관리자 영역입니다.
        </p>

        <button
          style={styles.mainBtn}
          onClick={() => navigate("/")}
        >
          🏠 메인 페이지로 이동
        </button>
      </div>
    </div>
  );
}

export default AdminHome;

/* =========================
   🎨 스타일 (완성)
========================= */
const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 80,
  },

  card: {
    width: 420,
    padding: "36px 32px",
    borderRadius: 18,
    background: "linear-gradient(145deg, #ffffff, #f1f5f9)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    textAlign: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 12,
    color: "#0f172a",
  },

  desc: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#475569",
    marginBottom: 32,
  },

  mainBtn: {
    width: "100%",
    height: 48,
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    boxShadow: "0 6px 14px rgba(37,99,235,0.4)",
    transition: "all 0.2s ease",
  },
};
