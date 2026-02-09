
import React from "react";
import { createContext, useContext, useState, useEffect } from "react";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("isAdmin");
    if (saved === "true") {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const login = (pw) => {
    if (pw === "1234") {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/* ⭐ 여기! 이 위치! */
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error(
      "useAdminAuth must be used within AdminAuthProvider"
    );
  }
  return context;
}
