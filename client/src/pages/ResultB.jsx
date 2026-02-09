import React from "react";
import ResultCommon from "./ResultCommon";

import beforeB from "../assets/before.jpg";
import middleB from "../assets/middle.jpg";
import afterB from "../assets/after.jpg";

function ResultB() {
  return (
    <ResultCommon
      gubun="유품정리"
      title="🕊️ 유품정리 — 견적 입력 & 결과"
      nameLabel="성명"
      resultNameSuffix="고객님"
      resultNotice="※ 유품정리는 현장 협의 후 최종 확정됩니다"
      // volumeOptions={["원룸", "투룸", "쓰리룸", "주택"]}
      volumeOptions={["소량", "반차", "1톤", "두차"]}
      optionFields={[
        { name: "has_elevator", label: "엘리베이터 있음" },
        { name: "ladder", label: "사다리차 사용" },
      ]}
      images={{
        before: beforeB,
        middle: middleB,
        after: afterB,
      }}
    />
  );
}

export default ResultB;