import { useEffect, useMemo, useRef, useState } from "react";

// 간단 스크립트 로더
function useScript(src, enabled = true) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    // 이미 로드된 경우
    if (document.querySelector(`script[src="${src}"]`)) {
      setLoaded(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => setLoaded(true);
    s.onerror = () => setLoaded(false);
    document.head.appendChild(s);
    return () => {};
  }, [src, enabled]);
  return loaded;
}

export default function MyContactMap({
  phone,
  displayPhone,
  address,
  kakaoApiKey,     // optional
  height = 400,
}) {
  const mapRef = useRef(null);
  const [useKakao, setUseKakao] = useState(Boolean(kakaoApiKey));
  const kakaoLoaded = useScript(
    useKakao && kakaoApiKey
      ? `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&libraries=services`
      : "",
    useKakao && Boolean(kakaoApiKey)
  );

  // iframe용 Google Maps embed URL (키 없이 주소만으로 표시)
  const iframeSrc = useMemo(() => {
    const q = encodeURIComponent(address || "");
    // 주소가 없으면 대한민국 중심부 대략 좌표로 fallback
    if (!q) {
      return "https://www.google.com/maps?q=37.5665,126.9780&z=14&output=embed";
    }
    // 검색 주소로 임베드
    return `https://www.google.com/maps?q=${q}&z=15&output=embed`;
  }, [address]);

  // Kakao 지도 초기화
  useEffect(() => {
    if (!useKakao || !kakaoLoaded || !mapRef.current) return;
    const { kakao } = window;
    if (!kakao?.maps) return;

    const container = mapRef.current;
    // 기본 좌표: 서울시청
    const defaultCenter = new kakao.maps.LatLng(37.5665, 126.9780);
    const map = new kakao.maps.Map(container, {
      center: defaultCenter,
      level: 3,
    });

    const geocoder = new kakao.maps.services.Geocoder();

    const placeMarker = (lat, lng, label) => {
      const pos = new kakao.maps.LatLng(lat, lng);
      map.setCenter(pos);
      const marker = new kakao.maps.Marker({ position: pos, map });
      const iw = new kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:12px;">${label || "여기"}</div>`,
      });
      iw.open(map, marker);
    };

    if (address) {
      // 주소 → 좌표 변환
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const { x, y, address_name } = result[0];
          placeMarker(Number(y), Number(x), address_name);
        } else {
          // 실패하면 기본 좌표로
          placeMarker(37.5665, 126.9780, "서울 시청");
        }
      });
    } else if (navigator.geolocation) {
      // 주소가 없으면 현재 위치 시도(HTTPS 필요)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          placeMarker(pos.coords.latitude, pos.coords.longitude, "현재 위치");
        },
        () => placeMarker(37.5665, 126.9780, "서울 시청")
      );
    } else {
      placeMarker(37.5665, 126.9780, "서울 시청");
    }
  }, [useKakao, kakaoLoaded, address, kakaoApiKey]);

  // 전화 링크
  const telHref = useMemo(() => `tel:${phone}`, [phone]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: height,
          borderRadius: 12,
          overflowX: "hidden",
          overflowY: "visible",
          border: "1px solid #e5e5e5",
        }}
      >
        {useKakao ? (
          // Kakao Map
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        ) : (
          // Iframe Map
          <iframe
            title="지도"
            src={iframeSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
      </div>

      {/* 우하단 플로팅 전화 버튼 */}
      <a
        href={telHref}
        aria-label={`전화 걸기 ${displayPhone || phone}`}
        onClick={() => {
          // 여기에 클릭 트래킹을 넣을 수 있습니다.
          // analytics.track("click_call", { tel: phone });
        }}
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 14px",
          borderRadius: 999,
          textDecoration: "none",
          border: "1px solid #e1e1e1",
          background: "#ffffff",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          fontWeight: 600,
          WebkitTapHighlightColor: "transparent",
        }}
      >
        {/* 심플한 전화 아이콘 (emoji로 대체) */}
        <span role="img" aria-hidden>📞</span>
        <span style={{ color: "#111" }}>{displayPhone || phone}</span>
      </a>

      {/* 지도 타입 토글 (선택 사항) */}
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setUseKakao(true)}
          disabled={!kakaoApiKey}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" }}
          title={kakaoApiKey ? "" : "카카오 API 키가 필요합니다."}
        >
          카카오맵
        </button>
        <button
          type="button"
          onClick={() => setUseKakao(false)}
          style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd" }}
        >
          간단 지도(iframe)
        </button>
      </div>
    </div>
  );
}
