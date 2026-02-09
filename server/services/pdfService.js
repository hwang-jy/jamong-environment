import { fileURLToPath } from "url";
import path from "path";
import PDFDocument from "pdfkit";
import fs from "fs";

/**
 * 📄 예상 견적서 PDF 생성 (완성본)
 */
export async function createEstimatePDF(data) {
  console.log("✅ PDF 함수 시작");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const fontPath = path.join(
    __dirname,
    "..",
    "fonts",
    "NotoSansKR-Regular.ttf"
  );

  if (!fs.existsSync(fontPath)) {
    throw new Error("❌ 한글 폰트 파일이 존재하지 않습니다.");
  }

  const filePath = path.join(
    process.cwd(),
    "temp",
    `estimate_${Date.now()}.pdf`
  );

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ⭐ 반드시 font → text 순서
    doc.font(fontPath);

    const cost = Number(data?.estimated_cost ?? data?.cost ?? 0);

    doc
      .fontSize(20)
      .text("자몽환경 예상 견적서", { align: "center" });

    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`고객명: ${data?.name ?? "-"}`);
    doc.text(`연락처: ${data?.phone ?? "-"}`);
    doc.text(`이메일: ${data?.email ?? "-"}`);
    doc.text(`주소: ${data?.address_f ?? ""} ${data?.address_r ?? ""}`);
    doc.text(`구분: ${data?.gubun ?? "-"}`);

    doc.moveDown();

    doc
      .fontSize(16)
      .fillColor("#2563eb")
      .text(`예상 금액: ${cost.toLocaleString()} 원`);

    doc.moveDown(2);

    doc
      .fillColor("#000")
      .fontSize(10)
      .text(
        "※ 본 견적은 현장 상황에 따라 변경될 수 있습니다.",
        { align: "center" }
      );

    doc.end();

    // ⭐⭐⭐ 여기서 핵심
    stream.on("finish", () => {
      console.log("✅ PDF 파일 쓰기 완료");
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
