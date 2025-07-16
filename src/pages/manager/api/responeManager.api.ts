// services/exResultService.ts
import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  CREATE_EXRESULT: "/ExResult",
  GET_EXRESULT_PAGED: (page = 1, size = 10) =>
    `/ExResult/paged?pageNumber=${page}&pageSize=${size}`,
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

    // Sửa điều kiện này:
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