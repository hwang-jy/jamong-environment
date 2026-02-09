// server/middleware/adminAuth.js
export default function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"];

  if (token !== "admin-secret") {
    return res.status(401).json({ message: "관리자 인증 실패" });
  }

  next();
}
