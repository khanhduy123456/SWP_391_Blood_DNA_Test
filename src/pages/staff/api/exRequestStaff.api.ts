// api/exRequest.api.ts
import axiosClient from "@/shared/lib/axiosClient";
import type { ExRequest, PagedExRequestResponse } from "../type/exRequestStaff";

const ENDPOINT = {
  GET_EX_REQUESTS_BY_ACCOUNT: (userId: number) =>
    `/ExRequest/account/${userId}`,
  GET_EXREQUEST_BY_STAFF_ID: (staffId: number) => `/ExRequest/staff/${staffId}`,
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
    console.error("Lỗi khi lấy danh sách yêu cầu kiểm tra theo staffId:", error.response?.data || error.message);
    throw error;
  }
};
