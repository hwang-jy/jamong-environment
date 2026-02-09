import axios from "axios";

/**
 * 📧 예상 견적 메일 발송
 */
export const sendEstimateMail = async (data) => {
  const res = await axios.post("http://localhost:5000/api/mail/estimate",
    {
      ...data,
      use_pdf: false,   // ⭐ 추가 (PDF 생성 안 함)
    }
  );
  return res.data;
};
