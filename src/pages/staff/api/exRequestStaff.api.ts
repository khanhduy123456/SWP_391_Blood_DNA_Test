// api/exRequest.api.ts
import axiosClient from "@/shared/lib/axiosClient";
import type { PagedExRequestResponse } from "../type/exRequestStaff";

const ENDPOINT = {
  GET_EX_REQUESTS_BY_ACCOUNT: (userId: number) =>
    `/ExRequest/account/${userId}`,
  GET_EXREQUEST_BY_ID: (id: number) => `/ExRequest/${id}`,
  GET_EXREQUEST_BY_STAFF_ID: (staffId: number) => `/ExRequest/staff/${staffId}`,
  UPDATE_EXREQUEST_STATUS: (requestId: number) =>
    `/ExRequest/${requestId}/status`,
};


export const getExRequestsByAccount = async (
  userId: number,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagedExRequestResponse> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_EX_REQUESTS_BY_ACCOUNT(userId),
      {
        params: { pageNumber, pageSize },
        headers: {
          Accept: "text/plain",
        },
      }
    );
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách đơn hàng theo user:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy danh sách yêu cầu kiểm tra theo staffId
export const getExRequestsByStaffId = async (
  staffId: number
): Promise<ExRequest[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_EXREQUEST_BY_STAFF_ID(staffId), {
      headers: {
        Accept: "application/json",
      },
    });

    return response.data as ExRequest[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Kiểm tra nếu lỗi là "Không tìm thấy yêu cầu nào" thì trả về mảng rỗng
    const errorMessage = error.response?.data || error.message;
    if (typeof errorMessage === 'string' && errorMessage.includes('Không tìm thấy yêu cầu nào')) {
      console.log(`Staff ${staffId} chưa được phân công booking nào`);
      return [];
    }
    
    console.error("Lỗi khi lấy danh sách yêu cầu kiểm tra theo staffId:", errorMessage);
    throw error;
  }
};

export interface ExRequest {
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

// ✅ Gọi API để lấy ExRequest theo ID
export const getExRequestById = async (
  staffId: number,
): Promise<ExRequest[]> => {
  try {
    console.log(`Gọi API: ${ENDPOINT.GET_EXREQUEST_BY_STAFF_ID(staffId)}`);
    const response = await axiosClient.get(
      ENDPOINT.GET_EXREQUEST_BY_STAFF_ID(staffId),
      {
        headers: {
          Accept: "*/*",
        },
      },
    );

    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data;
    }

    throw new Error(`Unexpected status code or data format: ${response.status}`);
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách ExRequest theo staffId:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
      };
      console.log(
        "Chi tiết lỗi:",
        axiosError.response?.status,
        axiosError.response?.data,
      );
    }
    throw new Error("Không thể lấy danh sách yêu cầu xét nghiệm");
  }
};

export interface UpdateStatus {
  requestId: number;
  status: string;
  statusName: string;
  updatedAt: string;
}

export const updateExRequestStatus = async (
  requestId: number,
  status: string
): Promise<UpdateStatus> => {
  try {
    const response = await axiosClient.patch(
      ENDPOINT.UPDATE_EXREQUEST_STATUS(requestId),
      { status },
      {
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data as UpdateStatus;
    }

    throw new Error(`Unexpected status code: ${response.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `Lỗi khi cập nhật trạng thái của ExRequest ${requestId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
