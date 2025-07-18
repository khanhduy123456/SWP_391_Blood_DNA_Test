import axiosClient from "@/shared/lib/axiosClient";
import { isAxiosError } from "axios";

const ENDPOINT = {
  GET_STAFF: "/Staff",
};

export interface Staff {
  id: number;
  fullName: string;
  email: string;
  userId: number;
}

export const getStaffList = async () => {
  try {
    const response = await axiosClient.get<Staff[]>(ENDPOINT.GET_STAFF, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Trả về mảng nhân viên trực tiếp
  } catch (error) {
    if (isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Lấy danh sách nhân viên thất bại. Vui lòng thử lại.";
      throw new Error(serverMessage);
    } else {
      throw new Error("Lỗi không xác định khi lấy danh sách nhân viên.");
    }
  }
};