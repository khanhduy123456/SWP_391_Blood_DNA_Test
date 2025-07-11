import axiosClient from "@/shared/lib/axiosClient";
import type { Service } from "../type/service";

const ENDPOINT = {
  GET_ALL_SERVICE: "/ServiceB",
  GET_PAGED_SERVICE: "/ServiceB/paged",
  CREATE_SERVICE: "/ServiceB",
  UPDATE_SERVICE: (id: number) => `/ServiceB/${id}`,
  DELETE_SERVICE: (id: number) => `/ServiceB/${id}`,
};

export interface PagedServiceResponse {
  items: Service[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
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
  pageSize: number = 10,
  order?: 'desc' | 'asc'
): Promise<PagedServiceResponse> => {
  try {
    const params: Record<string, string | number> = {
      pageNumber,
      pageSize,
    };
    
    if (order) {
      params.order = order;
    }

    const response = await axiosClient.get(ENDPOINT.GET_PAGED_SERVICE, {
      params,
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

export interface UpdateServicePayload {
  name: string;
  description: string;
  type: string;
  price: number;
  sampleMethodIds: number[];
}

// Cập nhật ServiceB theo id
export const updateService = async (
  id: number,
  data: UpdateServicePayload
): Promise<Service> => {
  try {
    const response = await axiosClient.put(ENDPOINT.UPDATE_SERVICE(id), data, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi cập nhật Service:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteService = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(ENDPOINT.DELETE_SERVICE(id), {
      headers: {
        Accept: "text/plain",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi xóa Service:", error.response?.data || error.message);
    throw error;
  }
};
