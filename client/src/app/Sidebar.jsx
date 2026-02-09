import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {open && <div className="overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <h3>메뉴</h3>

        <button onClick={() => { navigate("/"); onClose(); }}>
          회사 소개  1
        </button>

        <button onClick={() => { navigate("/contact"); onClose(); }}>
          사업자 관리
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
