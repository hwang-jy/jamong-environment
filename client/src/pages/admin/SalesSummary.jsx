import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SalesSummary.css";

export default function SalesSummary() {
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });

  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
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

  useEffect(() => {
    fetchData();
  }, []);

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
              <th>금액(천원)</th>
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
                  {row.phone ? row.phone.replace(/^010-/, "") : ""}
                </td>

                <td className="money">
                  {Math.round(Number(row.final_cost || 0) / 1000).toLocaleString()}
                </td>
              </tr>
            ))}

          </tbody>
        </table>

        <div className="subtotal">
          <span>소계</span>

          <strong>
            {(sum / 1000).toLocaleString()} 천원
          </strong>
        </div>

      </div>
    );
  };

  return (
    <div className="sales-summary">

      <div className="summary-title">
        <h2>💰 작업완료 매출 집계</h2>
        <p>기간별 작업 완료 금액 현황</p>
      </div>

      <div className="summary-filter">

        <div className="date-box">

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <span>~</span>

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

        </div>

        <button
          className="btn-search"
          onClick={fetchData}
        >
          조회
        </button>

      </div>

      <div className="summary-cards">

        <div className="card">
          <div className="card-title">
            생활폐기물
          </div>

          <div className="card-value">
            {data.생활폐기물.length}건
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            유품정리
          </div>

          <div className="card-value">
            {data.유품정리.length}건
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            사업장
          </div>

          <div className="card-value">
            {data.사업장.length}건
          </div>
        </div>

        <div className="card total-card">
          <div className="card-title">
            전체 매출
          </div>

          <div className="card-value">
            {(Number(data.total || 0) / 1000).toLocaleString()} 천원
          </div>
        </div>

      </div>

      {renderTable("생활폐기물", data.생활폐기물)}

      {renderTable("유품정리", data.유품정리)}

      {renderTable("사업장", data.사업장)}

    </div>
  );
}