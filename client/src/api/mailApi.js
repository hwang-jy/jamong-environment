import axios from "axios";
/**
 * 📧 예상 견적 메일 발송
 * @param {object} data - 견적 데이터
 * @param {boolean} usePdf - PDF 첨부 여부
 */
export const sendEstimateMail = async (data) => {
  const res = await axios.post("/api/mail/estimate",
    {
      ...data,
       use_pdf: usePdf,  //  PDF 선택 사항
    }
  );
  return res.data;
};
