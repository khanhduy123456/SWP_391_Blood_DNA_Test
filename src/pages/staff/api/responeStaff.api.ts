// services/exResultService.ts
import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  CREATE_EXRESULT: "/ExResult",
  GET_EXRESULT_PAGED: (page = 1, size = 10) =>
    `/ExResult/paged?pageNumber=${page}&pageSize=${size}`,
  GET_EX_RESULT_BY_ID: (id: number) => `/ExResult/${id}`,
};

export interface CreateExResult {
  requestId: number;
  fileUrl: string;
  resultDate: string; // ISO string
}

export const createExResult = async (
  data: CreateExResult
): Promise<void> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_EXRESULT, data, {
      headers: {
        Accept: "application/json",
      },
    });

    if (![200, 201, 204].includes(response.status)) {
      throw new Error("Tạo ExResult thất bại.");
    }
  } catch (error) {
    console.error("Lỗi khi tạo ExResult:", error);
    throw error;
  }
};

export interface ExResult {
  id: number;
  requestId: number;
  fileUrl: string;
  resultDate: string;
  createAt: string;
  updateAt: string;
}

export interface PagedExResultResponse {
  items: ExResult[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ✅ Gọi API phân trang danh sách kết quả xét nghiệm
export const getPagedExResults = async (
  page = 1,
  pageSize = 10
): Promise<PagedExResultResponse> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_EXRESULT_PAGED(page, pageSize),
      {
        headers: { Accept: "*/*" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kết quả xét nghiệm:", error);
    throw new Error("Không thể tải danh sách kết quả.");
  }
};
export interface ExResult {
  id: number;
  requestId: number;
  fileUrl: string;
  resultDate: string;
  createAt: string;
  updateAt: string;
}
export const getExResultById = async (id: number): Promise<ExResult> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_EX_RESULT_BY_ID(id),
      {
        headers: {
          Accept: "*/*",
        },
      }
    );

    if (response.status === 200 && response.data) {
      return response.data as ExResult;
    }

    throw new Error(`Unexpected status code: ${response.status}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Lỗi khi lấy ExResult với ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateExResult = async (
  id: number,
  data: { fileUrl: string; resultDate: string }
): Promise<void> => {
  try {
    const response = await axiosClient.put(`/ExResult/${id}`, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (![200, 204].includes(response.status)) {
      throw new Error("Cập nhật ExResult thất bại.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật ExResult:", error);
    throw error;
  }
};

export const getExResultByRequestId = async (requestId: number): Promise<ExResult> => {
  try {
    const response = await axiosClient.get(`/ExResult/by-request/${requestId}`, {
      headers: { Accept: "*/*" },
    });
    if (response.status === 200 && response.data) {
      return response.data as ExResult;
    }
    throw new Error("Không tìm thấy kết quả cho request này");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Lỗi khi lấy ExResult theo requestId ${requestId}:`, error.response?.data || error.message);
    throw error;
  }
};
