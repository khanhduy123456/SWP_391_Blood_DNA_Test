import axiosClient from "@/shared/lib/axiosClient";
import type { PagedExRequestResponse } from "../types/exRequestPaged";

const ENDPOINT = {
  CREATE_EX_REQUEST: "/ExRequest",
  GET_EX_REQUEST_BY_ACCOUNT: (userId: number) =>
    `/ExRequest/account/${userId}`,
  UPDATE_PARTIAL_EX_REQUEST: (id: number) => `/ExRequest/partial/${id}`,
  DELETE_EX_REQUEST: (id: number) => `/ExRequest/${id}`,
};

export interface UpdatePartialExRequest {
  serviceId: number;
  sampleMethodId: number;
  appointmentTime: string; // ISO format
}

export interface CreateExRequest {
  userId: number;
  serviceId: number;
  priorityId: number;
  sampleMethodId: number;
  appointmentTime: string; // ISO string (e.g., "2025-07-10T09:25:00.355Z")
}

export interface ExRequestResponse {
  id: number;
  userId: number;
  serviceId: number;
  priorityId: number;
  sampleMethodId: number;
  appointmentTime: string;
  createdAt: string;
}

export const createExRequest = async (
  data: CreateExRequest,
): Promise<ExRequestResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_EX_REQUEST, data);
    return response.data;
  } catch (error) {
    console.error("Error creating ExRequest:", error);
    throw error;
  }
};
export const getExRequestsByAccountId = async (
  userId: number,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedExRequestResponse> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_EX_REQUEST_BY_ACCOUNT(userId),
      {
        params: { pageNumber, pageSize },
        headers: {
          Accept: "text/plain",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ExRequests by Account ID:", error);
    throw error;
  }
};

export const updatePartialExRequest = async (
  requestId: number,
  data: UpdatePartialExRequest,
): Promise<void> => {
  try {
    await axiosClient.patch(ENDPOINT.UPDATE_PARTIAL_EX_REQUEST(requestId), data, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(" Lỗi khi cập nhật yêu cầu kiểm tra:", error?.response?.data || error.message);
    throw error;
  }
};

export const deleteExRequest = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(ENDPOINT.DELETE_EX_REQUEST(id), {
      headers: {
        Accept: "text/plain",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Lỗi khi xoá ExRequest:", error.response?.data || error.message);
    throw error;
  }
};
