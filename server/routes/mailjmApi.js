import express from "express";
import fs from "fs";

import { createEstimatePDF } from "../services/pdfService.js";
import { sendMail } from "../services/mailService.js";
import { estimateMailAdmin } from "../templates/estimateMailAdmin.js";
import { estimateMailUser } from "../templates/estimateMailUser.js";
import { saveMailLog } from "../services/mailLogService.js";

const router = express.Router();

router.post("/estimate", async (req, res) => {
  const data = req.body;
  const adminEmail = process.env.ADMIN_MAIL;
  let pdfPath = null;

  if (!adminEmail) {
    return res.status(500).json({ ok: false, error: "ADMIN_MAIL 미설정" });
  }

  try {
    const adminHtml = estimateMailAdmin(data);
    const userHtml = estimateMailUser(data);

    /* =========================
       ✅ 관리자 메일 (PDF ❌)
    ========================= */
    await sendMail({
      to: adminEmail,
      subject: "[관리자] 새 견적 접수",
      html: adminHtml,
    });

    /* =========================
       ✅ 유저 메일 (PDF ⭕)
    ========================= */
    if (data.email && data.email.includes("@")) {
      // ⭐ 여기서만 PDF 생성
      pdfPath = await createEstimatePDF(data);

      await sendMail({
        to: data.email,
        subject: "[자몽환경] 예상 견적 안내",
        html: userHtml,
        attachments: [
          { filename: "estimate.pdf", path: pdfPath },
        ],
      });
    }

    await saveMailLog({
      mail_type: "estimate",
      to_email: data.email ?? null,
      admin_email: adminEmail,
      waste_id: data.waste_id ?? null,
      estimated_cost: data.estimated_cost ?? data.cost ?? 0,
      success: true,
      error_message: null,
    });

    res.json({ ok: true });

  } catch (err) {
    await saveMailLog({
      mail_type: "estimate",
      to_email: data.email ?? null,
      admin_email: adminEmail,
      waste_id: data.waste_id ?? null,
      estimated_cost: data.estimated_cost ?? data.cost ?? 0,
      success: false,
      error_message: err.message,
    });

    res.status(500).json({ ok: false, error: err.message });

  } finally {
    // ✅ 유저에게 PDF 보냈을 때만 삭제
    if (pdfPath && fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }
  }
});

export default router;
