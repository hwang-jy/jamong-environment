import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.naver.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NAVER_MAIL_USER,
    pass: process.env.NAVER_MAIL_PASS,
  },
});

/**
 * SMTP 연결 확인
 */
export async function verifyMail() {
  try {
    await transporter.verify();
    console.log("📧 네이버 메일 SMTP 연결 성공");
  } catch (err) {
    console.error("❌ 네이버 메일 SMTP 실패:", err.message);
  }
}

/**
 * 메일 발송
 */
export async function sendMail({ to, subject, html, attachments = [] }) {
  return transporter.sendMail({
    from: `"자몽환경" <${process.env.NAVER_MAIL_USER}>`,
    to,
    subject,
    html,
    attachments,
  });
}