import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  ASSIGN_STAFF_TO_REQUEST: (requestId: number) => `/ExRequest/${requestId}/assign`,
  ACCEPT_REQUEST: (requestId: number) => `/ExRequest/${requestId}/accept`,
  CANCEL_REQUEST: (requestId: number) => `/ExRequest/${requestId}/cancel`,
};

export interface AssignStaffResponse {
  requestId: number;
  assignedStaff: {
    staffId: number;
    staffName: string;
  };
  updatedAt: string;
}
export interface AcceptExRequestResponse {
  requestId: number;
  status: string;
  statusName: string;
  updatedAt: string;
}

/**
 * Gọi API phân công staff cho ExRequest.
 * @param requestId - ID của ExRequest.
 * @param staffId - ID của staff được phân công.
 * @returns Thông tin request sau khi phân công staff.
 */
export const assignStaffToExRequest = async (
  requestId: number,
  staffId: number
): Promise<AssignStaffResponse> => {
  try {
    console.log(`Gọi API phân công staff ID = ${staffId} cho request ID = ${requestId}`);

    const response = await axiosClient.patch(
      ENDPOINT.ASSIGN_STAFF_TO_REQUEST(requestId),
      { staffId },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Phân công thành công:", response.data);
      return response.data;
    }

    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error("Lỗi khi phân công staff cho ExRequest:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
      };
      console.log(
        "Chi tiết lỗi:",
        axiosError.response?.status,
        axiosError.response?.data
      );
    }

    throw new Error("Không thể phân công staff cho ExRequest");
  }
};
export const acceptExRequest = async (
  requestId: number
): Promise<AcceptExRequestResponse> => {
  try {
    console.log(` Gọi API xác nhận ExRequest ID = ${requestId}`);

    const response = await axiosClient.post(
      ENDPOINT.ACCEPT_REQUEST(requestId),
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log("Đã xác nhận yêu cầu:", response.data);
      return response.data;
    }

    throw new Error(` Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error(" Lỗi khi xác nhận ExRequest:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
      };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }

    throw new Error("Không thể xác nhận ExRequest");
  }
};
export const cancelExRequest = async (requestId: number): Promise<void> => {
  try {
    console.log(` Gọi API hủy ExRequest ID = ${requestId}`);

    const response = await axiosClient.post(
      ENDPOINT.CANCEL_REQUEST(requestId),
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status === 200) {
      console.log(" Hủy yêu cầu thành công");
      return;
    }

    throw new Error(` Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error(" Lỗi khi hủy ExRequest:", error);

    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status?: number; data?: unknown };
      };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }

    throw new Error("Không thể hủy ExRequest");
  }
};