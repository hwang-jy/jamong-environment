import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminWasteDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`/api/admin/wastes/${id}`, {
      headers: { "x-admin-token": "admin-secret" }
    }).then(res => {
            console.log("DETAIL RESPONSE:", res.data);
            setData(res.data.waste);
            }).catch(err => {
            console.error("❌ 상세 조회 실패", err);
      });
    }, [id]);

  if (!data) return <p>로딩중...</p>;

  return (
    <>
     <div style={{ padding: 40, background: "#fff" }}>
      <h1>상세 페이지 테스트</h1>
      <h2>{data.name}</h2>
      <p>전화: {data.phone}</p>
      <p>주소: {data.address_f} {data.address_r}</p>
      <p>금액: {data.cost}</p>

      {data.photo_url && (
        <img src={data.photo_url} width="300" />
      )}
      </div>
    </>
  );
}
