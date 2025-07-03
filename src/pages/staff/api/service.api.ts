import axiosClient from "@/shared/lib/axiosClient";
import type { Service } from "../type/service";

const ENDPOINT = {
  GET_ALL_SERVICE: "/ServiceB",
  GET_PAGED_SERVICE: "/ServiceB/paged",
  CREATE_SERVICE: "/ServiceB",
};

export interface PagedServiceResponse {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  data: Service[];
}

// Lấy danh sách Service không phân trang
export const getAllService = async (): Promise<Service[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_SERVICE, {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data as Service[];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Service:", error);
    throw error;
  }
};

// Lấy danh sách Service có phân trang
export const getPagedService = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagedServiceResponse> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_PAGED_SERVICE, {
      params: {
        pageNumber,
        pageSize,
      },
      headers: {
        Accept: "application/json",
      },
    });
    return response.data as PagedServiceResponse;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách Service phân trang:", error);
    throw error;
  }
};

// Payload cho tạo Service
export interface CreateServicePayload {
  name: string;
  description: string;
  type: string;
  price: number;
  sampleMethodIds: number[];
}

// Tạo ServiceB
export const createService = async (
  data: CreateServicePayload
): Promise<Service> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_SERVICE, data, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi tạo Service:", error.response?.data || error.message);
    throw error;
  }
};