import express from "express";
import pool from "../db.js";
import fs from "fs";

import { createEstimatePDF } from "../services/pdfService.js";
import { sendMail } from "../services/mailService.js";
import { estimateMailTemplate } from "../templates/estimateMail.js";

const router = express.Router();

router.post("/resend/:id", async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool.query(
    `SELECT * FROM mail_logs WHERE id=$1`,
    [id]
  );
  const log = rows[0];
  if (!log) return res.status(404).json({ ok: false });

  let pdfPath;

  try {
    // ⭐ const 제거!!!
    pdfPath = await createEstimatePDF({
      name: "재발송",
      phone: "",
      address: "",
      gubun: "견적",
      estimated_cost: log.estimated_cost,
    });

    console.log("📎 pdfPath =", pdfPath);
    console.log("📎 exists =", fs.existsSync(pdfPath));

  } catch (e) {
    return res.status(500).json({
      ok: false,
      error: "PDF 생성 실패: " + e.message,
    });
  }

  if (!fs.existsSync(pdfPath)) {
    return res.status(500).json({
      ok: false,
      error: "PDF 파일 없음",
    });
  }

  await sendMail({
    to: log.to_email,
    subject: "[자몽환경] 견적 메일 재발송",
    html: estimateMailTemplate({
      name: "고객님",
      phone: "",
      address: "",
      gubun: "견적",
      estimated_cost: log.estimated_cost,
    }),
    attachments: [
      { filename: "estimate.pdf", path: pdfPath },
    ],
  });

  setTimeout(() => {
    fs.existsSync(pdfPath) && fs.unlinkSync(pdfPath);
  }, 3000);

  res.json({ ok: true });
});

export default router;
