import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./BeforeAfter.css";

function BeforeAfter({ beforeImg, middleImg, afterImg }) {
  const [openImg, setOpenImg] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [orientation, setOrientation] = useState("portrait");

  // ESC 닫기
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenImg(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 이미지 열기 (❌ RAF, ❌ null 리셋 제거)
 const openImage = (src) => {
  setLoaded(false);

  const img = new Image();
  img.src = src;

  img.onload = () => {
    const isPortrait = img.naturalHeight > img.naturalWidth;
    setOrientation(isPortrait ? "portrait" : "landscape");
    setOpenImg(src); // ⭐ 디코딩 완료 후에만 열기
    setLoaded(true);
  };
};

  return (
    <>
      <div className="ba-container">
        {beforeImg && (
          <div className="ba-item" onClick={() => openImage(beforeImg)}>
            <span className="ba-label">before</span>
            <img src={beforeImg} alt="before" />
          </div>
        )}

        {middleImg && (
          <div className="ba-item" onClick={() => openImage(middleImg)}>
            <span className="ba-label">상차후</span>
            <img src={middleImg} alt="middle" />
          </div>
        )}

        {afterImg && (
          <div className="ba-item" onClick={() => openImage(afterImg)}>
            <span className="ba-label">after</span>
            <img src={afterImg} alt="after" />
          </div>
        )}
      </div>

      {openImg &&
        createPortal(
          <>
             <div className="img-modal" onClick={() => setOpenImg(null)}>
               <img
                  key={openImg}
                  src={openImg}
                  className={orientation}
                  decoding="sync"
                  loading="eager"
                  onClick={(e) => e.stopPropagation()}
                />
            </div>

            <button className="modal-close" onClick={() => setOpenImg(null)}>
              ×
            </button>
          </>,
             document.body
          )}
      </>
  );
}

export default BeforeAfter;
