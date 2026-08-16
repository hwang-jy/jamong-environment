import React, { useState, useEffect } from "react";
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
  const [showPostcode, setShowPostcode] = useState(false);

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
     전화번호
  ========================= */
  const onPhoneChange = (e) => {

    if (e.nativeEvent.isComposing) return;

    let v = e.target.value.replace(/[^0-9]/g, "");

    if (v.length >= 7) {
      v = v.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
    } else if (v.length >= 3) {
      v = v.replace(/(\d{3})(\d+)/, "$1-$2");
    }

    setForm((prev) => ({
      ...prev,
      phone: v,
    }));
  };

  /* =========================
     주소 검색
  ========================= */
  useEffect(() => {

    if (!showPostcode) return;

    const wrap = document.getElementById("postcode-wrap");

    new window.daum.Postcode({

      oncomplete: (data) => {

        setForm((prev) => ({
          ...prev,
          address_f: data.address,
        }));

        setShowPostcode(false);
      }

    }).embed(wrap);

  }, [showPostcode]);

  const onSearchAddress = () => {
    setShowPostcode(true);
  };

  /* =========================
     예상금액 계산
  ========================= */
  const onSubmit = async () => {

    if (loading) return;

    setLoading(true);

    if (!form.name || !form.phone) {
      alert("필수 항목을 입력하세요");
      setLoading(false);
      return;
    }

    if (form.email && !form.email.includes("@")) {
      alert("이메일 형식이 올바르지 않습니다");
      setLoading(false);
      return;
    }

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

      setResult(data.waste);

    } catch (err) {

      console.error(err);
      alert("처리 중 오류가 발생했습니다");
    }

    setLoading(false);
  };

  /* =========================
     카카오 최종 견적 상담
     이름 + 구분 복사 후
     바로 카카오 상담방 열기
  ========================= */
 const openKakaoConsult = async () => {

    if (!form.name) {
      alert("이름을 먼저 입력해주세요.");
      return;
    }

    const consultText =
      `이름: ${form.name}
      구분: ${form.gubun || ""}`;

      try {
        await navigator.clipboard.writeText(consultText);

        alert(
          "성명과 구분이 복사되었습니다.\n\n카카오톡이 열리면 붙여넣고 사진을 올려주세요."
        );

      } catch (err) {
        console.error("클립보드 복사 실패:", err);
      }

      window.open(
        "https://open.kakao.com/o/gM7rznxi",
        "_blank"
      );
    };

  return (
    <>
      <div className="resultA-container">

        <h2>{title}</h2>

        <div className="service-call-box">
          📞 대표전화
          <a href="tel:01040701291">
            010-4070-1291
          </a>
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

            {/* 주소 */}
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

          {/* 폐기물 옵션 */}
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

                  <label
                    key={opt.name}
                    className="volume-option"
                  >

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

          <button
            type="button"
            className="submit-btn"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "계산 중..." : "💰 예상금액 계산"}
          </button>

          <button
            type="button"
            className="kakao-btn"
            onClick={openKakaoConsult}
          >
            💬 카카오 상담
          </button>

        </div>

        {result && (

          <div className="result-box">

            <h3>✅ 예상 견적 결과</h3>

            <p className="result-cost">
              {result.cost.toLocaleString()}원
            </p>

            {form.ladder && (
              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginTop: "10px"
                }}
              >
                ※ 사다리차 사용 시 추가금액이 발생할 수 있습니다.
              </p>
            )}

            <p className="result-sub">
              {resultNotice}
            </p>

          </div>

        )}

        {/* 홈 버튼 */}
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

      {/* 주소 검색창 */}
      {showPostcode && (

        <div className="postcode-modal">

          <div className="postcode-box">

            <button
              className="postcode-close"
              onClick={() => setShowPostcode(false)}
            >
              ✕
            </button>

            <div
              id="postcode-wrap"
              style={{
                width: "100%",
                height: "100%",
              }}
            ></div>

          </div>

        </div>

      )}

    </>
  );
}

export default ResultCommon;