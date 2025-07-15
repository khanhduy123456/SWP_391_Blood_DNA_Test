import { axiosClientUpload } from "./axiosClient";


export const uploadPdfToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_pdf_upload");
  formData.append("folder", "pdfs");

  // cloudName của bạn
  const cloudName = "dkj6d9rtj";

  const response = await axiosClientUpload.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.secure_url; // chính là fileUrl bạn sẽ gắn vào API backend
};
