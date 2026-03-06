// client/src/pages/CategorySelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./CategorySelect.css";
import TrustBoxes from "../components/TrustBoxes"; 

function CategorySelect() {
  const nav = useNavigate();

  return (
    <>
    {/* <Header pageTitle="견적 신청  페이지" onMenuClick={openSidebar} />  */}

    <div className="category-container">

        {/* ✅ 신뢰 문구 박스 */}
         {/* 소개 문구 */}
         
          <TrustBoxes />
          
      {/* 📞 대표 전화 (여기에!) */}
      <div className="service-call-box">
          <div className="call-highlight">
            <span className="call-icon">📞</span>
            <span className="call-label">대표전화</span>
            <a href="tel:01088662305" className="call-number">
              010-8866-2305
            </a>
          </div>
        </div>


      <h1>서비스 구분 선택</h1>
      <h2>A: 생활폐기물 · B: 유품정리 · C: 사업장</h2>

      <div className="button-group">
        <button className="select-btn" onClick={() => nav("/resultA")}>A 선택</button>
        <button className="select-btn" onClick={() => nav("/resultB")}>B 선택</button>
        <button className="select-btn" onClick={() => nav("/resultC")}>C 선택</button>
      </div>
    </div>
    </>
  );
}
export default CategorySelect ;

