export function estimateMailUser(data) {
  const cost = Number(data.estimated_cost ?? data.cost ?? 0).toLocaleString();

  return `
  <div style="font-family: Arial, sans-serif; line-height:1.6">
    <h2>✅ 자몽환경 예상 견적 안내</h2>

    <p><strong>${data.name ?? "고객"}님</strong>,  
    문의 주셔서 감사합니다.</p>

    <h3>💰 예상 견적 금액</h3>
    <p style="font-size:22px; font-weight:bold; color:#1976d2">
      ${cost} 원
    </p>

    <h3>📋 선택하신 조건</h3>
    <ul>
      <li>구분: ${data.gubun}</li>
      <li>물량: ${data.volume_type}</li>
      <li>엘리베이터: ${data.has_elevator ? "있음" : "없음"}</li>
      <li>사다리차: ${data.ladder ? "필요" : "불필요"}</li>
    </ul>

    <p style="margin-top:16px">
      ※ 실제 작업 환경에 따라 금액은 달라질 수 있습니다.
    </p>

    <hr/>

    <h3>☎️ 문의 및 상담</h3>
    <p>
      📞 전화: <strong>010-4070-1291</strong><br/>
      💬 카카오톡: <strong>자몽환경</strong>
    </p>

    <p style="color:#666; margin-top:12px">
      빠르고 정직한 정리 서비스로 찾아뵙겠습니다.
    </p>
  </div>
  `;
}
