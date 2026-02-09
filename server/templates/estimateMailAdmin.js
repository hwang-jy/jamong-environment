export function estimateMailAdmin(data) {
  const cost = Number(data.estimated_cost ?? data.cost ?? 0).toLocaleString();

  return `
  <div style="font-family: Arial, sans-serif; line-height:1.6">
    <h2>📥 새 견적 접수</h2>

    <h3>👤 고객 정보</h3>
    <ul>
      <li><strong>이름:</strong> ${data.name ?? "-"}</li>
      <li style="color:#d32f2f; font-size:16px">
        <strong>📞 전화:</strong> ${data.phone ?? "-"}
      </li>
      <li><strong>📧 이메일:</strong> ${data.email ?? "(미입력)"}</li>
    </ul>

    <h3>🏠 주소 (중요)</h3>
    <p style="background:#f5f5f5; padding:10px; border-radius:6px">
      ${data.address_f ?? ""} ${data.address_r ?? ""}
    </p>

    <h3>🧾 견적 정보</h3>
    <ul>
      <li><strong>구분:</strong> ${data.gubun}</li>
      <li><strong>물량:</strong> ${data.volume_type}</li>
      <li><strong>엘리베이터:</strong> ${data.has_elevator ? "있음" : "없음"}</li>
      <li><strong>사다리차:</strong> ${data.ladder ? "필요" : "불필요"}</li>
    </ul>

    <h3>💰 예상 금액</h3>
    <p style="font-size:20px; font-weight:bold; color:#2e7d32">
      ${cost} 원
    </p>

    <hr/>
    <p style="color:#666">
      ※ 관리자 확인 후 상태 변경 및 연락 진행
    </p>
  </div>
  `;
}
