import React from "react";
import ResultCommon from "./ResultCommon";

import beforeA from "../assets/Frame1.jpg";
import middleA from "../assets/Frame2.jpg";
import afterA from "../assets/Frame3.jpg";

export default function ResultA() {
  return (
    <ResultCommon
      title="생활폐기물 견적"
      gubun="생활폐기물"
      nameLabel="성명"
      resultNameSuffix="고객님"
      resultNotice="현장 상황에 따라 금액이 달라질 수 있습니다"
      volumeOptions={["소량", "반차", "1톤", "두차"]}
      optionFields={[
        { name: "has_elevator", label: "엘리베이터 있음" },
        { name: "ladder", label: "사다리차 사용" },
      ]}
      images={{
            before: beforeA,
            middle: middleA,
            after: afterA,
          }}
    />
  );
}
