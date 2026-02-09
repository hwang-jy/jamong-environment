export function estimateMailTemplate(data) {
  return `
    <h2>📦 ${data.gubun} 예상 견적 안내</h2>
    <p><b>고객명:</b> ${data.name}</p>
    <p><b>연락처:</b> ${data.phone}</p>
    <p><b>주소:</b> ${data.address}</p>
    <hr />
    <h3 style="color:#2563eb">
      <p>예상 금액: ${Number(data?.estimated_cost || 0).toLocaleString()}원</p>
    </h3>
    <p>PDF 견적서를 첨부해 드립니다.</p>
    <p>자몽환경 드림</p>
  `;
}
