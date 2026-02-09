// src/pages/Company/CompanyIntro.jsx
import React from "react";
import "./CompanyIntro.css";
import logo from "../../assets/logo.png";
import { brandSummary } from "./BrandSummary";

function CompanyIntro() {
  return (
    <div className="company-page">
      <div className="company-card">

        {/* 좌측 상단 로고 + 회사명 */}
        <div className="company-header">
          <img src={logo} alt="자몽환경 로고" className="company-logo" />

          <div className="company-title">
            <h1>{brandSummary.name}</h1>
            <span>{brandSummary.enName}</span>
          </div>
        </div>

        {/* 회사 설명 */}
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
