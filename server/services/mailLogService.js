import pool from "../db.js";

export async function saveMailLog(log) {
  const {
    mail_type,
    to_email,
    admin_email,
    waste_id,
    estimated_cost,
    success,
    error_message,
  } = log;

  await pool.query(
    `
    INSERT INTO mail_logs
    (mail_type, to_email, admin_email, waste_id, estimated_cost, success, error_message)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [
      mail_type,
      to_email,
      admin_email,
      waste_id,
      estimated_cost,
      success,
      error_message,
    ]
  );
}
