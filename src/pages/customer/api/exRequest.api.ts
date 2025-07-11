import axiosClient from "@/shared/lib/axiosClient";
import type { PagedExRequestResponse } from "../types/exRequestPaged";

const ENDPOINT = {
  CREATE_EX_REQUEST: "/ExRequest",
  GET_EX_REQUEST_BY_ACCOUNT: (userId: number) =>
    `/ExRequest/account/${userId}`,
};

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