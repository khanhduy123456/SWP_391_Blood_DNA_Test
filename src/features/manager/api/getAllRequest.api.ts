import axiosClient from "@/shared/lib/axiosClient";
import { isAxiosError } from "axios";

const ENDPOINT = {
  GET_REQUESTS: "ExRequest/status",
};

export interface Request {
  id: number;
  userId: number;
  userName: string;
  serviceId: number;
  serviceName: string;
  priorityId: number;
  sampleMethodId: number;
  sampleMethodName: string;
  statusId: string;
  statusName: string;
  appointmentTime: string;
  createAt: string;
  updateAt: string;
  staffId: number;
  staffName: string;
}

export const getAllRequests = async () => {
  try {
    const response = await axiosClient.get<Request[]>(ENDPOINT.GET_REQUESTS, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // Trả về mảng request trực tiếp
  } catch (error) {
    if (isAxiosError(error)) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Lấy danh sách request thất bại. Vui lòng thử lại.";
      throw new Error(serverMessage);
    } else {
      throw new Error("Lỗi không xác định khi lấy danh sách request.");
    }
  }
};