import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalesSummary.css";

export default function SalesSummary() {

  /* ===========================
     처음 실행 시 이번 달 1일 ~ 오늘
  =========================== */

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");

    return `${year}-${month}-01`;
  });

  const [toDate, setToDate] = useState(() => {
    const d = new Date();

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [data, setData] = useState({
    생활폐기물: [],
    유품정리: [],
    사업장: [],
    total: 0,
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/admin/sales-summary", {
        headers: {
          "x-admin-token": "admin-secret",
        },
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
      });

      if (res.data.ok) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("집계 조회 실패");
    }
  };

  /* 처음 화면 열 때 이번 달 자동 조회 */
  useEffect(() => {
    fetchData();
  }, []);

  /* ===========================
     CSV 다운로드
  =========================== */

  const downloadCSV = () => {
    const allRows = [
      ...data.생활폐기물.map((row) => ({
        ...row,
        구분: "생활폐기물",
      })),
      ...data.유품정리.map((row) => ({
        ...row,
        구분: "유품정리",
      })),
      ...data.사업장.map((row) => ({
        ...row,
        구분: "사업장",
      })),
    ];

    if (allRows.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const csvRows = [
      ["날짜", "구분", "이름", "연락처", "금액"],
      ...allRows.map((row) => [
        new Date(row.created_at).toLocaleDateString("ko-KR"),
        row.구분,
        row.name || "",
        row.phone || "",
        Number(row.final_cost || 0),
      ]),
    ];

    const csvContent = csvRows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "").replace(/"/g, '""');
            return `"${text}"`;
          })
          .join(",")
      )
      .join("\n");

    /* 엑셀 한글 깨짐 방지 */
    const BOM = "\uFEFF";

    const blob = new Blob(
      [BOM + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `매출집계_${fromDate}_${toDate}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* ===========================
     표
  =========================== */

  const renderTable = (title, rows) => {
    const sum = rows.reduce(
      (a, b) => a + Number(b.final_cost || 0),
      0
    );

    return (
      <div className="summary-box">

        <div className="section-header">
          <div className="section-title">
            📦 {title}
          </div>

          <div className="section-count">
            {rows.length}건
          </div>
        </div>

        <table className="summary-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>이름</th>
              <th>연락처</th>
              <th>금액(원)</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="4">
                  데이터가 없습니다.
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id}>

                <td>
                  {new Date(row.created_at)
                    .toLocaleDateString("ko-KR", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })
                    .replace(/ /g, "")}
                </td>

                <td>{row.name}</td>

                <td>
                  {row.phone
                    ? row.phone.replace(/^010-/, "")
                    : ""}
                </td>

                <td className="money">
                  {Number(
                    row.final_cost || 0
                  ).toLocaleString()}
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="subtotal">
          <span>소계</span>

          <strong>
            {sum.toLocaleString()}원
          </strong>
        </div>

      </div>
    );
  };

  return (
    <div className="sales-summary">

      <div className="summary-title">
        <h2>💰 작업완료 매출 집계</h2>

        <div className="summary-subtitle-row">
          <p>기간별 작업 완료 금액 현황</p>

          <button
            type="button"
            className="btn-csv"
            onClick={downloadCSV}
          >
            CSV 다운로드
          </button>
        </div>
      </div>

      {/* 날짜 + 조회 */}
      <div className="summary-filter">

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(e.target.value)
          }
        />

        <span className="date-wave">~</span>

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(e.target.value)
          }
        />

        <button
          type="button"
          className="btn-search"
          onClick={fetchData}
        >
          조회
        </button>

      </div>

      {/* 건수 */}
      <div className="count-row">

        <div className="count-card">
          <span>생활폐기물</span>
          <strong>
            {data.생활폐기물.length}건
          </strong>
        </div>

        <div className="count-card">
          <span>유품정리</span>
          <strong>
            {data.유품정리.length}건
          </strong>
        </div>

        <div className="count-card">
          <span>사업장</span>
          <strong>
            {data.사업장.length}건
          </strong>
        </div>

      </div>

      {/* 전체 매출 */}
      <div className="total-row">

        <span>전체 매출</span>

        <strong>
          {Number(
            data.total || 0
          ).toLocaleString()}원
        </strong>

      </div>

      {renderTable(
        "생활폐기물",
        data.생활폐기물
      )}

      {renderTable(
        "유품정리",
        data.유품정리
      )}

      {renderTable(
        "사업장",
        data.사업장
      )}

    </div>
  );
}