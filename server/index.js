import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import pool from "./db.js";
import adminRoutes from "./routes/admin.js";
import mailRoutes from "./routes/mailjmApi.js";
import mailResendRoutes from "./routes/mailResend.js"; 
import { verifyMail } from "./services/mailService.js";


// ⭐ dotenv 이후 실행 (정상)
verifyMail();
// DB Pool 설정 (환경변수에 맞게 수정하세요)

const app = express();

// __dirname 설정 (ESM 환경)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 미들웨어
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
// 메일 Api
app.use("/api/mail", mailRoutes);
app.use("/api/mail", mailResendRoutes); 
// 관리자 API
app.use("/api/admin", adminRoutes);

// 루트 확인용
app.get("/", (req, res) => {
  res.send("서버 OK");
});

// DB 연결 + 테스트   ← ⭐
pool.connect()
   .then(() => console.log(" postgreSQL DB 연결 성공", process.env.DB_NAME))
   .catch(err => console.error("DB 연결 실패", err.message));

pool.query("select 1")
.then(() => console.log("✅ DB 쿼리 테스트 성공"))
.catch(err => console.error("❌ DB 쿼리 테스트 실패", err.message));

// 견적 계산 함수
function calcEstimate({ volume_type, has_elevator, use_ladder_car }) {
  let base = 0;
  switch (volume_type) {
    case "소량": base = 50000; break;
    case "반차": base = 250000; break;
    case "1톤": base = 420000; break;
    case "두차": base = 840000; break;
    default: base = 0;
  }
  if (has_elevator) base += 10;
  if (use_ladder_car) base += 25000;
  return base;
}

// 견적 요청 API
// wastes 테이블에 INSERT
app.post("/api/wastes/estimate", async (req, res) => {
  try {
    const { name, phone, address_f, address_r, volume_type, 
            status, gubun, has_elevator, ladder,
            photo_url} = req.body;

    if (!name || !volume_type) {
      return res.status(400).json({ ok: false, error: "필수 값 누락" });
    }        
          // ✅ gubun 방어 처리
    const allowedGubun = ["생활폐기물", "유품정리", "사업장"];
    const safeGubun = allowedGubun.includes(gubun)
      ? gubun
      : "생활폐기물";
      
    const cost = calcEstimate({
      volume_type,
      has_elevator,
      use_ladder_car: ladder
    });


     // 🔒 cost NOT NULL 보호
    if (!cost || cost <= 0) {
      return res.status(400).json({
        ok: false,
        error: "금액 계산 실패"
      });
    }

    const q = `
      INSERT INTO wastes (name, phone, address_f, address_r,  volume_type,
       gubun, has_elevator, ladder, status, cost, photo_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *;
    `;
    const v = [name, 
              phone || null,
              address_f || null, 
              address_r || null,
              volume_type, 
              safeGubun,        // ✅ 한글 그대로 저장
              has_elevator, 
              ladder, 
              "최초입력",     // ⭐ 문자열은 JS에서
              cost,
              photo_url || null];
    const { rows } = await pool.query(q, v);
    res.json({ ok: true, waste: rows[0] });

  } catch (err) {
    console.error("❌ 서버 오류:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});


//   개발후 처리 할것 임시 코맨트처리 지우지 말것
// React 정적 파일 제공
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
