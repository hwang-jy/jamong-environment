// src/pages/admin/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

function AdminLogin() {
  const [pw, setPw] = useState("");
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!pw.trim()) {
      alert("비밀번호를 입력하세요");
      return;
    }

    const ok = login(pw);

    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      alert("비밀번호가 올바르지 않습니다");
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>관리자 로그인</h2>

        <input
          type="password"
          placeholder="비밀번호 입력"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button style={styles.button} onClick={handleLogin}>
          로그인
        </button>
      </div>
    </div>
  );
}
const styles = {
  bg: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f5f9",
  },
  card: {
    width: 320,
    padding: 24,
    borderRadius: 12,
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: 14,
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #cbd5e1",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AdminLogin;
