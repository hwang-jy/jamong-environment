import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import WasteDetailModal from "./WasteDetailModal";
import "./AdminWastes.css";

export default function AdminWastes() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 📅 날짜 필터
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const limit = 10;
  const nav = useNavigate();

  const totalPages = Math.max(1, Math.ceil((total || 0) / limit));
  /**
   * 📄 목록 조회
   */
  const fetchData = async (p = 1) => {
    try {
      const res = await axios.get(
        "/api/admin/wastes",
        {
          headers: { "x-admin-token": "admin-secret" },
          params: {
            page: p,
            limit,
            from_date: fromDate || undefined,
            to_date: toDate || undefined,
          },
        }
      );

    console.log("📦 API 응답:", res.data); // 🔥 이거 추가


      if (res.data?.ok) {
          setList(Array.isArray(res.data.list) ? res.data.list : []);
          setTotal(typeof res.data.total === "number" ? res.data.total : 0);
          setPage(p);
      }
    } catch (err) {
      console.error("❌ 관리자 목록 조회 실패", err);
      setList([]);
      setTotal(0);
    }
  };

  /**
   * 📥 CSV 다운로드
   */
  const downloadCSV = async () => {
    const res = await axios.get(
      "/api/admin/wastes-export",
      {
        headers: { "x-admin-token": "admin-secret" },
        params: {
          from_date: fromDate || undefined,
          to_date: toDate || undefined,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "wastes.csv";
    a.click();
  };

  /**
   * 🚀 최초 진입 시 → 최근 7일 자동 조회
   */
  useEffect(() => {
    fetchData(1);
  }, [fromDate, toDate]);

useEffect(() => {
  console.log("selectedId:", selectedId);
}, [selectedId]);

  return (
    <>
      {/* <h2>접수 목록</h2> */}

      {/* 📅 날짜 필터 + CSV */}
      <div className="filter-bar">
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <span className="date-sep">~</span>

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button className="btn-3d btn-search"
                onClick={() => fetchData(1)}>
          조회
        </button>

        <button className="btn-csv" 
                onClick={downloadCSV}>
          CSV 다운로드
        </button>
      </div>

      {/* 📋 테이블 */}
      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="col-name">이름</th>
              <th className="col-phone">연락처</th>
              <th className="col-status">상태</th>
              <th className="col-cost">예상금액</th>
              <th className="col-final">확정금액</th>
              <th className="col-date">년월일</th>
              <th className="col-manage col-manage-sticky">관리</th>

            </tr>
          </thead>

          <tbody>
            {Array.isArray(list) && list.length === 0 && (
              <tr>
                <td colSpan="7" align="center">
                  데이터 없음
                </td>
              </tr>
            )}

            {Array.isArray(list) && list.map((row) => (
              <tr key={row.id}>
                <td className="col-name">{row.name}</td>

                <td className="col-phone">
                  {row.phone}
                </td>
              <td className="col-status">
              <span
                className={`status-badge ${
                  typeof row.status === "string" ? row.status : ""
                }`}
              >
                  {row.status}
                </span>
              </td>

                <td className="col-cost">
                  {row.cost ? row.cost.toLocaleString() + "원" : "-"}
                </td>

                <td className="col-final">
                  {row.final_cost ? row.final_cost.toLocaleString() + "원" : "-"}
                </td>

                <td className="col-date">
                  {row.created_at
                    ? new Date(row.created_at).toLocaleDateString("ko-KR")
                    : "-"}
                </td>

                <td className="col-manage col-manage-sticky">
                  <div className="manage-cell">
                    <button
                      className="btn-3d btn-detail"
                      onClick={() => setSelectedId(row.id)}
                    >
                      상세
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedId && (
            <WasteDetailModal
              id={selectedId}
              onClose={() => setSelectedId(null)}
              onSaved={() => {
                setSelectedId(null);
                fetchData(page); // 저장 후 현재 페이지 새로고침
              }}
        />
      )}

      {/* ⏮️ 페이지네이션 */}
      <div className="pagination">
        <button
          disabled={page <= 1}
          onClick={() => fetchData(page - 1)}
        >
          ◀ 이전
        </button>

        <span className="page-info">
          {page} / {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => fetchData(page + 1)}
        >
          다음 ▶
        </button>
      </div>

    </>
  );
}

