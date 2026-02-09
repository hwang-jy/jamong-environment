// src/components/TrustBoxes.jsx
import React from "react";
import "./TrustBoxes.css";

function TrustBoxes() {
  return (
    <section className="trust-section">
      <div className="trust-box trust-blue">
        소형 폐기물 전담 회사로 믿고 맡기실 수 있습니다
      </div>

      <div className="trust-box trust-green">
        처리 전후 고객님의 희망에 결코 누가되지 않겠습니다
      </div>

      <div className="trust-box trust-orange">
        사후 관리를 철저히 하겠습니다
      </div>
    </section>
  );
}

export default TrustBoxes;
