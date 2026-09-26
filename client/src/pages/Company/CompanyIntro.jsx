import React from "react";
import { useNavigate } from "react-router-dom";
import "./CompanyIntro.css";
import logo from "../../assets/logo.png";
import { brandSummary } from "./BrandSummary";

function CompanyIntro() {
  const navigate = useNavigate();

  return (
    <div className="company-page">
      <div className="company-card">
        <button
          type="button"
          className="company-close"
          onClick={() => navigate("/")}
          aria-label="회사 소개 닫기"
        >
          ×
        </button>

        <div className="company-header">
          <img src={logo} alt="자몽환경 로고" className="company-logo" />

          <div className="company-title">
            <h1>{brandSummary.name}</h1>
            <span>{brandSummary.enName}</span>
          </div>
        </div>

        <div className="company-description">
          {brandSummary.intro.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyIntro;