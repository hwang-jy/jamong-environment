import pool from "../db.js";

export async function saveMailLog(log) {
  const {
    mail_type,
    to_email,
    waste_id,
    success,
    error_message,
  } = log;

  const subject =
    mail_type === "admin"
      ? "[관리자] 새 견적 접수"
      : "[자몽환경] 예상 견적 안내";

  await pool.query(
    `
    INSERT INTO mail_logs
    (waste_id, mail_type, recipient, subject, status, error_message)
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      waste_id,
      mail_type,
      to_email,
      subject,
      success ? "success" : "failed",
      error_message,
    ]
  );
}