// services/exRequestService.ts
import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_EX_REQUESTS: "/ExRequest",
  GET_PAGED: (page: number, size: number) =>
    `/ExRequest/paged?pageNumber=${page}&pageSize=${size}`,
};

export interface ExRequest {
  id: number;
  userId: number;
  serviceId: number;
  priorityId: number;
  sampleMethodId: number;
  statusId: string;
  appointmentTime: string;
  createAt: string;
  updateAt: string;
  staffId: number;
}

// ✅ Gọi API lấy danh sách ExRequest và loại trừ các trạng thái nếu cần
export const getAllExRequests = async (
  excludeStatuses: string[] = [],
  statusId?: number | string
): Promise<ExRequest[]> => {
  try {
    const params: string[] = [];
    if (excludeStatuses.length > 0) {
      params.push(
        excludeStatuses
          .map((status) => `excludeStatuses=${encodeURIComponent(status)}`)
          .join("&")
      );
    }
    if (statusId !== undefined) {
      params.push(`statusId=${statusId}`);
    }
    const queryString = params.length > 0 ? `?${params.join("&")}` : "";
    const response = await axiosClient.get(
      `${ENDPOINT.GET_ALL_EX_REQUESTS}${queryString}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.error("Bạn cần đăng nhập để truy cập.");
      throw new Error("UNAUTHORIZED");
    }
    console.error("Lỗi khi lấy danh sách ExRequest:", error);
    throw new Error("Không thể lấy dữ liệu ExRequest.");
  }
};
export interface ExRequest {
    id: number;
    userId: number;
    serviceId: number;
    sampleMethodId: number;
    statusId: string;
    statusName: string;
    appointmentTime: string;
    createAt: string;
    updateAt: string;
    staffId: number;
  }
  
  export interface PagedExRequestResponse {
    items: ExRequest[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  
  // Gọi API lấy ExRequest có phân trang
  export const getPagedExRequests = async (
    page: number = 1,
    pageSize: number = 10
  ): Promise<PagedExRequestResponse> => {
    try {
      const response = await axiosClient.get(
        ENDPOINT.GET_PAGED(page, pageSize),
        {
          headers: {
            Accept: "*/*",
            // Nếu cần, thêm Authorization header:
            // Authorization: `Bearer ${yourToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gọi API getPagedExRequests:", error);
      throw new Error("Không thể tải danh sách yêu cầu xét nghiệm.");
    }
  };
  