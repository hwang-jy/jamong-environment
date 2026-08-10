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
        <h3>{title}</h3>

        <table className="summary-table">
          <thead>
            <tr>
              <th>날짜</th>
              <th>이름</th>
              <th>연락처</th>
              <th>금액</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="4">데이터 없음</td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  {new Date(row.created_at)
                    .toLocaleDateString()}
                </td>

                <td>{row.name}</td>

                <td>{row.phone}</td>

                <td>
                  {Number(row.final_cost).toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="subtotal">
          소계 :
          <b>{sum.toLocaleString()}원</b>
        </div>
      </div>
    );
  };

  return (
    <div className="sales-page">

      <h2>💰 작업완료 매출집계</h2>

      <div className="filter-bar">

        <input
          type="date"
          value={fromDate}
          onChange={(e)=>setFromDate(e.target.value)}
        />

        <span>~</span>

        <input
          type="date"
          value={toDate}
          onChange={(e)=>setToDate(e.target.value)}
        />

        <button onClick={fetchData}>
          조회
        </button>

      </div>

      {renderTable("생활폐기물", data.생활폐기물)}

      {renderTable("유품정리", data.유품정리)}

      {renderTable("사업장", data.사업장)}

      <div className="grand-total">

        전체 합계 :
        <strong>
          {Number(data.total || 0).toLocaleString()}원
        </strong>

      </div>

    </div>
  );
}