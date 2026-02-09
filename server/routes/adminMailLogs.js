import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminMailLogs() {
  const [list, setList] = useState([]);

  const fetchLogs = async () => {
    const res = await axios.get("/api/admin/mail-logs", {
      headers: { "x-admin-token": "admin-secret" },
    });
    setList(res.data.list);
  };

  const resend = async (id) => {
    if (!window.confirm("메일을 재발송 하시겠습니까?")) return;
    await axios.post(`/api/mail/resend/${id}`);
    alert("재발송 완료");
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="admin-page">
      <h2>📧 메일 발송 이력</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>받는 사람</th>
            <th>금액</th>
            <th>상태</th>
            <th>날짜</th>
            <th>관리</th>
          </tr>
        </thead>
       <tbody>
          {list.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.to_email}</td>

              {/* ✅ 금액 (완전 안전) */}
              <td>
                {typeof m.estimated_cost === "number"
                  ? m.estimated_cost.toLocaleString()
                  : "-"}
                원
              </td>

              {/* 상태 */}
              <td>{m.success ? "성공" : "실패"}</td>

              {/* 날짜 */}
              <td>
                {m.created_at
                  ? new Date(m.created_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {!m.success && (
                    <button onClick={() => resend(m.id)}>재발송</button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
