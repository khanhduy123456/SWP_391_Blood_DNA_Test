import axiosClient from "@/shared/lib/axiosClient";
import { isAxiosError } from "axios";

const ENDPOINT = {
 REGISTER: "/account/Register",
};

export interface RegisterUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export const registerApi = async (userData: RegisterUser) => {
  try {
    const response = await axiosClient.post(ENDPOINT.REGISTER, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      // Trích xuất thông báo lỗi từ backend nếu có
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      throw new Error(serverMessage);
    } else {
      // Lỗi không phải từ Axios
      throw new Error("Lỗi không xác định khi đăng ký.");
    }
  }
};