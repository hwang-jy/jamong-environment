import express from "express";
import pool from "../db.js";

const router = express.Router();

/**
 * 🔐 관리자 토큰 체크
 */
router.use((req, res, next) => {
  const token = req.headers["x-admin-token"];
  if (token !== "admin-secret") {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
});

/**
 * ✅ 접수 목록 조회
 * GET /api/admin/wastes
 * ?page=1&limit=10&from_date=YYYY-MM-DD&to_date=YYYY-MM-DD
 */
router.get("/wastes", async (req, res) => {
  try {
    // ✅ 캐시 차단
    res.setHeader("Cache-Control", "no-store");

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const offset = (page - 1) * limit;

    /* 📅 날짜 처리 */
    let fromDate;
    let toDate;

    if (req.query.from_date) {
      fromDate = new Date(req.query.from_date);
    } else {
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
    }
    fromDate.setHours(0, 0, 0, 0);

    if (req.query.to_date) {
      toDate = new Date(req.query.to_date);
    } else {
      toDate = new Date();
    }
    toDate.setHours(23, 59, 59, 999);

    /* 📊 전체 개수 */
    const totalResult = await pool.query(
      `
      SELECT COUNT(*)
      FROM wastes
      WHERE created_at >= $1
        AND created_at < $2
      `,
      [fromDate, toDate]
    );

    const total = Number(totalResult.rows[0].count);

    /* 📄 목록 조회 */
    const listResult = await pool.query(
      `
      SELECT
        id,
        name,
        phone,
        status,
        cost,
        final_cost,
        created_at
      FROM wastes
      WHERE created_at >= $1
        AND created_at < $2
      ORDER BY id DESC
      LIMIT $3 OFFSET $4
      `,
      [fromDate, toDate, limit, offset]
    );

    res.json({
      ok: true,
      list: listResult.rows,
      total,
    });
  } catch (err) {
    console.error("❌ 관리자 목록 조회 오류", err);
    res.status(500).json({ ok: false, error: "Server Error" });
  }
});

/**
 * ✅ 접수 상세 조회
 * GET /api/admin/wastes/:id
 */
router.get("/wastes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        phone,
        address_f,
        address_r,
        gubun,
        cost,
        final_cost,
        status,
        created_at
      FROM wastes
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: "데이터 없음",
      });
    }

    res.json({
      ok: true,
      waste: result.rows[0],
    });
  } catch (err) {
    console.error("❌ 접수 상세 조회 오류", err);
    res.status(500).json({
      ok: false,
      error: "Server Error",
    });
  }
});

/**
 * ✏️ 접수 상태 / 확정금액 수정
 * PATCH /api/admin/wastes/:id
 * 
 */
router.patch("/wastes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, final_cost } = req.body;

    if (!status && final_cost === undefined) {
      return res.status(400).json({
        ok: false,
        error: "수정할 값 없음",
      });
    }

    // ✅ 확정금액 안전 처리
    const safeFinalCost =
      final_cost === "" || final_cost === undefined
        ? null
        : Number(final_cost);

    // ⭐⭐⭐ 핵심 로직 ⭐⭐⭐
    // 작업완료인데 확정금액 없으면 차단
    if (
      status === "작업완료" &&
      (!safeFinalCost || safeFinalCost <= 0)
    ) {
      return res.status(400).json({
        ok: false,
        error: "작업완료 시 확정금액은 필수입니다",
      });
    }

    const result = await pool.query(
      `
      UPDATE wastes
      SET
        status = $1,
        final_cost = $2
      WHERE id = $3
      `,
      [status, safeFinalCost, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        error: "수정 대상 없음",
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ 접수 수정 오류", err);
    res.status(500).json({
      ok: false,
      error: "Server Error",
    });
  }
});

/**
 * 📥 CSV 다운로드
 * GET /api/admin/wastes-export
 */
router.get("/wastes-export", async (req, res) => {
  try {
    let fromDate;
    let toDate;

    if (req.query.from_date) {
      fromDate = new Date(req.query.from_date);
    } else {
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
    }
    fromDate.setHours(0, 0, 0, 0);

    if (req.query.to_date) {
      toDate = new Date(req.query.to_date);
    } else {
      toDate = new Date();
    }
    toDate.setHours(23, 59, 59, 999);
    toDate.setDate(toDate.getDate() + 1);

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        phone,
        status,
        gubun,
        cost,
        final_cost,
        created_at
      FROM wastes
      WHERE created_at >= $1
        AND created_at < $2
      ORDER BY id DESC
      `,
      [fromDate, toDate]
    );

    let csv =
        "\uFEFF" +              // ✅ UTF-8 BOM (엑셀 필수)
        "sep=,\n" +             // ✅ 엑셀 구분자 힌트
        "ID,이름,연락처,상태,구분,예상금액,확정금액,접수일\n";  

      result.rows.forEach((r) => {
        csv += [
          r.id,
          r.name ?? "",
          r.phone ?? "",
          r.status ?? "",
          r.gubun ?? "",
          r.cost ?? "",
          r.final_cost ?? "",
          r.created_at
            ? r.created_at.toISOString()
            : ""
        ].join(",") + "\n";
      });
      
    res.header("Content-Type", "text/csv; charset=utf-8");
    res.header(
      "Content-Disposition",
      "attachment; filename=wastes.csv"
    );
    res.send(csv);
  } catch (err) {
    console.error("❌ CSV 다운로드 오류", err);
    res.status(500).send("CSV Export Error");
  }
});

export default router;
