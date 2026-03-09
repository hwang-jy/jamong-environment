import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ResultCommon.css";
import BeforeAfter from "./BeforeAfter";

function ResultCommon({
  title,
  gubun,
  nameLabel,
  resultNameSuffix,
  resultNotice,
  images,
  volumeOptions = [],
  optionFields = [],
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "", 
    address_f: "",
    address_r: "",
    gubun,
    volume_type: "1톤",
    has_elevator: false,
    ladder: false,
    photo_url: "",
  });

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  /* =========================
     공통 change
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* =========================
     전화번호 전용
  ========================= */
  const onPhoneChange = (e) => {
    if (e.nativeEvent.isComposing) return;

    let v = e.target.value.replace(/[^0-9]/g, "");
    if (v.length >= 7) v = v.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    else if (v.length >= 3) v = v.replace(/(\d{3})(\d+)/, "$1-$2");

    setForm((prev) => ({ ...prev, phone: v }));
  };

  /* =========================
     주소 검색
  ========================= */
  const onSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({ ...prev, address_f: data.address }));
      },
    }).open();
  };

  /* =========================
     전송
  ========================= */
  const onSubmit = async () => {
      if (loading) return;   // ⭐ 중복 클릭 방지
         setLoading(true);
      if (!form.name || !form.phone) {
         alert("필수 항목을 입력하세요");
      return;
    }
      // 2️⃣ 이메일 형식 체크 (⭐ 여기!)
    if (form.email && !form.email.includes("@")) {
      alert("이메일 형식이 올바르지 않습니다");
      return;
    }
    
    console.log("🚨 전송되는 form:", form);

    try {
      const { data } = await axios.post(
        "/api/wastes/estimate",
        form
      );

      if (!data.ok) {
        alert("견적 계산 실패");
        setLoading(false);
        return;
      }

      // 2️⃣ 결과 표시
      setResult(data.waste);

      // 3️⃣ 자동 메일 발송
      alert("✅ 예상 견적 계산 및 메일 발송 완료");
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다");
    }

     setLoading(false);

  };

  return (
    <>
      <div className="resultA-container">
        <h2>{title}</h2>

        <div className="service-call-box">
           📞 대표전화 <a href="tel:01088662305">010-8866-2305</a>
        </div>

        <div className="estimate-form">
          <div className="info-card">
            <div className="form-row">
              <div className="input-group">
                <label>{nameLabel}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>전화번호</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={onPhoneChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label>이메일</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="견적 받을 이메일 (선택)"
              />
            </div>

            <div className="address-group">
              <div className="input-group full">
                <label>주소</label>
                <input
                  name="address_f"
                  value={form.address_f}
                  readOnly
                  onClick={onSearchAddress}
                />
              </div>

              <div className="input-group full">
                <input
                  name="address_r"
                  value={form.address_r}
                  onChange={handleChange}
                  placeholder="상세주소 (선택)"
                />
              </div>
            </div>
          </div>

          {/* 🔹 요청사항 반영된 부분 */}
          <div className="input-group full volume-group">
            <div className="volume-grid">
              <span className="volume-label">
                예상 폐기물 양 <em>(입력필수)</em> :
              </span>

              <select
                className="volume-select"
                name="volume_type"
                value={form.volume_type}
                onChange={handleChange}
              >
                {volumeOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>

              <div className="volume-options">
                {optionFields.map((opt) => (
                  <label key={opt.name} className="volume-option">
                    <input
                      type="checkbox"
                      name={opt.name}
                      checked={form[opt.name]}
                      onChange={handleChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button type="button" className="submit-btn" 
                  onClick={onSubmit} disabled={loading}>
            💰 예상금액 계산
          </button>
        </div>

        {result && (
          <div className="result-box">
            <h3>✅ 예상 견적 결과</h3>
            <p className="result-cost">
              {result.cost.toLocaleString()}원
            </p>
            <p className="result-sub">{resultNotice}</p>
          </div>
        )}
        {/* ⭐ 홈으로 버튼 (복구) */}
        <div className="back-select">
          <Link to="/" className="home-btn">
            🏠 홈으로
          </Link>
        </div>
      </div>

      {images && (
        <BeforeAfter
          beforeImg={images.before}
          middleImg={images.middle}
          afterImg={images.after}
        />
      )}
      <a
        href="tel:01088662305"
        onClick={() => console.log("전화 연결")}
        className="call-cta"
      >
        📞 전화 상담 바로 연결
      </a>
      <a
        href="https://open.kakao.com/o/abcd1234"
        target="_blank"
        rel="noopener noreferrer"
        className="kakao-cta"
      >
        💬 카카오 상담
      </a>
    </>
  );
}

export default ResultCommon;
