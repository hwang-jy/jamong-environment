import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WasteDetailModal.css";

function WasteDetailModal({ id, onClose, onSaved }) {
  const [data, setData] = useState({
    status: "",
    final_cost: 0,
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/admin/wastes/${id}`, {
        headers: { "x-admin-token": "admin-secret" },
      })
      .then((res) => {
        if (res.data.ok) {
          const waste = res.data.waste;
              // ⭐ 최초 로딩 시에만 접수로 변환
          setData({
            ...waste,
            status:
              waste.status === "최초입력"
                ? "접수"
                : waste.status,
          });
        }
      });
  }, [id]);

  const handleSave = async () => {
      // ✅ 작업완료인데 확정금액 없음 → 차단
    if (
      data.status === "작업완료" &&
      Number(data.final_cost) <= 0
    ) {
      alert("작업완료 시 확정금액을 반드시 입력해야 합니다.");
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/admin/wastes/${id}`,
        {
          status: data.status,
          final_cost:
          data.final_cost ?? 0,
        },
        {
          headers: { "x-admin-token": "admin-secret" },
        }
      );

      if (res.data.ok) {
        alert("저장되었습니다");
        onSaved();
      }
    } catch (e) {
      console.error(e);
      alert("저장 실패");
    }
  };

  if (!data) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h3>접수 상세</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <span className="modal-field-label">성명</span>
            <span className="modal-field-value">{data.name}</span>
          </div>

          <div className="modal-field">
            <span className="modal-field-label">전화</span>
            <span className="modal-field-value">{data.phone}</span>
          </div>

          <div className="modal-field">
            <span className="modal-field-label">구분</span>
            <span className="modal-field-value">{data.gubun}</span>
          </div>

          <div className="modal-field">
            <span className="modal-field-label">주소</span>
            <span className="modal-field-value">
              {data.address_f} {data.address_r}
            </span>
          </div>

          <div className="modal-field modal-field-emphasis">
            <span className="modal-field-label">예상금액</span>
            <span className="modal-field-value">
              {data.cost ? data.cost.toLocaleString() + "원" : "-"}
            </span>
          </div>

          <div className="modal-field modal-field-emphasis">
            <span className="modal-field-label">확정금액</span>
            <input
              className={`modal-field-input ${
              data.status === "작업완료" && (!data.final_cost || data.final_cost <= 0)
                ? "input-error"
                : ""
              }`}
              type="number"
              value={data.final_cost ?? ""}
              onChange={(e) =>
                setData({
                  ...data,
                  final_cost:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </div>

          <div className="modal-field modal-field-emphasis">
            <span className="modal-field-label">처리상태</span>
            <select
              className="modal-field-input"
              value={data.status}
              onChange={(e) =>
                setData((prev) => ({ ...prev, status: e.target.value }))
              }
            >
                {/* ⭐ 최초입력은 서버 값이 최초입력일 때만 표시 */}
              {data.status === "최초입력" && (
                <option value="최초입력" disabled>
                  최초입력 (고객 접수 대기)
                </option>
              )}
              <option value="접수">접수</option>
              <option value="요청확인">요청확인</option>
              <option value="견적확정">견적확정</option>
              <option value="작업중">작업중</option>
              <option value="작업완료">작업완료</option>
              <option value="보류">보류</option>
              <option value="취소">취소</option>
              <option value="처리중">처리중</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-save" onClick={handleSave}>
            저장
          </button>
          <button className="btn-cancel" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

export default WasteDetailModal;
