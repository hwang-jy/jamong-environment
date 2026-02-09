// client/src/pages/ResultA.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ResultA.css";
import BeforeAfter from "./BeforeAfter";

function ResultA() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address_f: "",
    address_r: "",
    status: "접수",
    gubun: "A",
    volume_type: "1톤",
    has_elevator: false,
    ladder: false,
    photo_url: ""
  });

  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onPhoneChange = (e) => {
    let v = e.target.value.replace(/[^0-9]/g, "");
    if (v.length >= 7) v = v.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    else if (v.length >= 3) v = v.replace(/(\d{3})(\d+)/, "$1-$2");
    setForm({ ...form, phone: v });
  };

  const onSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm({ ...form, address_f: data.address });
      },
    }).open();
  };

const onSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.phone) {
    alert("필수 항목을 입력하세요");
    return;
  }

  const { data } = await axios.post(
    "http://localhost:5000/api/wastes/estimate",
    form
  );

  if (data.ok) {
    setResult(data.waste);   // ✅ 결과 표시

    // ✅ 🔥 여기서 초기화 (이 위치가 정답)
    setForm({
      name: "",
      phone: "",
      address_f: "",
      address_r: "",
      status: "접수",
      gubun: "A",
      volume_type: "1톤",
      has_elevator: false,
      ladder: false,
      photo_url: ""
    });
   }
  };
  return (
    <> 
    <div className="resultA-container">
      <h2>🏠 A: 생활폐기물 — 견적 입력 & 결과</h2>

      <form className="estimate-form" onSubmit={onSubmit}>
        <div className="info-card">
          <div className="form-row">
            <div className="input-group">
              <label>성명</label>
              <input type="text"
                     name="name" value={form.name} 
                     onChange={onChange} 
                     required /> 
            </div>

            <div className="input-group">
              <label>전화번호</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onPhoneChange}
                maxLength="13"
                required />  
            </div>
          </div>

          <div className="address-group">
             <div className="input-group full">
                  <label>주소</label>
                <div className="address-row">
                  <input
                     name="address_f"
                     value={form.address_f}
                     readOnly
                     onClick={onSearchAddress}
                     style={{ cursor: "pointer" }}
                     placeholder="클릭하여 주소 검색"
                  />
                </div>
             </div>


             <div className="input-group full">
                <input
                   name="address_r"
                   value={form.address_r}
                   onChange={onChange}
                   placeholder="상세주소 (선택)"
                />
             </div>
          </div>
       </div>      

        <div className="input-group full">
          <label>종류</label>
          <select name="volume_type" value={form.volume_type} onChange={onChange}>
            <option value="소량">소량</option>
            <option value="반차">반차</option>
            <option value="1톤">1톤</option>
            <option value="두차">두차</option>
          </select>
        </div>

        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="has_elevator" checked={form.has_elevator} onChange={onChange} />
            엘리베이터 있음
          </label>
          <label>
            <input type="checkbox" name="ladder" checked={form.ladder} onChange={onChange} />
            사다리차 사용
          </label>
        </div>

        <button type="submit" className="submit-btn">💰 예상금액 계산</button>
      </form>

      {/* {result && (
        <div className="result-box">
          <h3>계산 결과</h3>
          <p>이름: {result.name}</p>
          <p>금액: {result.cost.toLocaleString()}원</p>
        </div>
      )} */}
      {result && (
         <div className="result-box">
            <h3>✅ 예상 견적 결과</h3>
            <p className="result-name">{result.name} 고객님</p>
               <p className="result-cost">
                  {result.cost.toLocaleString()}원
               </p>
            <p className="result-sub">
               ※ 현장 상황에 따라 변동될 수 있습니다
            </p>
         </div>
      )}

      <div className="contact-box">
        <a href="tel:01012345678">📞 010-1234-5678</a>
      </div>

      <div className="back-select">
        <Link to="/">🏠 홈으로</Link>
      </div>
    </div>
    {/* 🔹 사진 영역 (배경 위) */}
    <BeforeAfter />
 </>  
 );
}

export default ResultA;
