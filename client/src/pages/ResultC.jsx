import React from "react";
import ResultCommon from "./ResultCommon";
import beforeC from "../assets/before1.jpg";
import middleC from "../assets/middle1.jpg";
import afterC from "../assets/after1.jpg";

export default function ResultC() {
  return (
    <ResultCommon
      gubun="사업장"
      title="🏢 사업장 폐기물 — 견적 입력 & 결과"
      nameLabel="사업장명"
      resultNameSuffix="사업장"
      resultNotice="※ 사업장 폐기물은 현장 확인 후 최종 확정됩니다"
      volumeOptions={["소량", "반차", "1톤", "두차"]}
      optionFields={[
        { name: "has_elevator", label: "엘리베이터 있음" },
        { name: "ladder", label: "사다리차 사용" },
      ]}
      images={{
        before: beforeC,
        middle: middleC,
        after: afterC, 
      }}
    />
  );
}
