import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_KIT_DELIVERIES: "/KitDelivery",
  GET_PAGED_KIT_DELIVERIES: "/KitDelivery/paged",
  CREATE_KIT_DELIVERY: "/KitDelivery",
  UPDATE_KIT_DELIVERY: (id: number) => `/KitDelivery/${id}`,
  DELETE_KIT_DELIVERY: (id: number) => `/KitDelivery/${id}`,
  GET_KIT_DELIVERY_BY_ID: (id: number) => `/KitDelivery/${id}`,
  UPDATE_KIT_DELIVERY_STATUS: (id: number) => `/KitDelivery/${id}/status`,
};

export interface KitDelivery {
  id: number;
  requestId: number;
  kitId: number;
  kitType: string;
  createAt: string;
  updateAt: string;
  status: string;
}

export interface CreateKitDeliveryRequest {
  requestId: number;
  kitId: number;
  kitType: string;
}

export interface UpdateKitDeliveryRequest {
  kitId: number;
  kitType: string;
  status: string;
}

export interface PagedKitDeliveryResponse {
  items: KitDelivery[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Lấy tất cả kit deliveries
export const getAllKitDeliveries = async (): Promise<KitDelivery[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_KIT_DELIVERIES, {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data as KitDelivery[];
  } catch (error) {
    console.error("Error fetching Kit Deliveries:", error);
    throw error;
  }
};

// Lấy kit deliveries có phân trang
export const getPagedKitDeliveries = async (
  pageNumber: number, 
  pageSize: number, 
  sortOrder?: 'desc' | 'asc',
  searchTerm?: string
): Promise<PagedKitDeliveryResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { pageNumber, pageSize };
    if (sortOrder) params.sortOrder = sortOrder;
    if (searchTerm && searchTerm.trim()) params.searchTerm = searchTerm.trim();
    
    const response = await axiosClient.get(ENDPOINT.GET_PAGED_KIT_DELIVERIES, {
      params,
      headers: {
        Accept: "*/*",
      },
    });
    return response.data as PagedKitDeliveryResponse;
  } catch (error) {
    console.error("Error fetching paged Kit Deliveries:", error);
    throw error;
  }
};

// Tạo kit delivery mới
export const createKitDelivery = async (kitDeliveryData: CreateKitDeliveryRequest): Promise<KitDelivery> => {
  try {
    console.log("Gọi API tạo KitDelivery:", kitDeliveryData);
    console.log("Endpoint:", ENDPOINT.CREATE_KIT_DELIVERY);
    
    const response = await axiosClient.post(ENDPOINT.CREATE_KIT_DELIVERY, kitDeliveryData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    
    if (response.status === 200 || response.status === 201) {
      return response.data as KitDelivery;
    }
    
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error("Lỗi khi tạo KitDelivery:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể tạo mới KitDelivery");
  }
};

// Cập nhật kit delivery
export const updateKitDelivery = async (
  id: number,
  kitDeliveryData: UpdateKitDeliveryRequest
): Promise<string> => {
  try {
    console.log(`Gọi API cập nhật KitDelivery ID = ${id}:`, kitDeliveryData);
    
    const response = await axiosClient.put(ENDPOINT.UPDATE_KIT_DELIVERY(id), kitDeliveryData, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    
    if (response.status === 200) {
      return response.data;
    }
    
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error("Lỗi khi cập nhật KitDelivery:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể cập nhật KitDelivery");
  }
};

// Xóa kit delivery
export const deleteKitDelivery = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(ENDPOINT.DELETE_KIT_DELIVERY(id), {
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status !== 200) {
      throw new Error("Xoá Kit Delivery thất bại.");
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi xoá Kit Delivery:", error.response?.data || error.message);
    throw error;
  }
};

// Lấy kit delivery theo ID
export const getKitDeliveryById = async (id: number): Promise<KitDelivery> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_KIT_DELIVERY_BY_ID(id), {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data as KitDelivery;
  } catch (error) {
    console.error(`Error fetching Kit Delivery with ID ${id}:`, error);
    throw error;
  }
};

// Cập nhật trạng thái kit delivery từ Pending sang Sent
export const updateKitDeliveryStatus = async (id: number): Promise<{ kitDeliveryId: number; status: string; receivedAt: string }> => {
  try {
    console.log(`Gọi API PATCH trạng thái KitDelivery ID = ${id}`);
    
    const response = await axiosClient.patch(ENDPOINT.UPDATE_KIT_DELIVERY_STATUS(id), {}, {
      headers: {
        Accept: "*/*",
      },
    });
    
    if (response.status === 200) {
      console.log("Cập nhật trạng thái thành công:", response.data);
      return response.data;
    }
    
    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error("Lỗi khi cập nhật trạng thái KitDelivery:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể cập nhật trạng thái KitDelivery");
  }
}; 

// Lấy ExRequest theo id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getExRequestById = async (id: number): Promise<any> => {
  try {
    const response = await axiosClient.get(`/ExRequest/${id}`, {
      headers: {
        Accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ExRequest with ID ${id}:`, error);
    throw error;
  }
}; 