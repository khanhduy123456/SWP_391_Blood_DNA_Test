// services/exResultService.ts
import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_EXRESULTS_BY_USER: (userId: number, page = 1, size = 10) =>
    `/ExResult/by-user/${userId}?pageNumber=${page}&pageSize=${size}`,
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

export const getExResultsByUser = async (
  userId: number,
  page: number = 1,
  pageSize: number = 10
): Promise<PagedExResultResponse> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_EXRESULTS_BY_USER(userId, page, pageSize),
      {
        headers: { Accept: "*/*" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách kết quả xét nghiệm:", error);
    throw new Error("Không thể lấy kết quả xét nghiệm.");
  }
};
