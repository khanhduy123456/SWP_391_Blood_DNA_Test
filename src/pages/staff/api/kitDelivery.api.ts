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
    const response = await axiosClient.post(ENDPOINT.CREATE_KIT_DELIVERY, kitDeliveryData, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });
    return response.data as KitDelivery;
  } catch (error) {
    console.error("Error creating Kit Delivery:", error);
    throw error;
  }
};

// Cập nhật kit delivery
export const updateKitDelivery = async (
  id: number,
  kitDeliveryData: UpdateKitDeliveryRequest
): Promise<string> => {
  try {
    const response = await axiosClient.put(ENDPOINT.UPDATE_KIT_DELIVERY(id), kitDeliveryData, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating Kit Delivery with ID ${id}:`, error);
    throw error;
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
    const response = await axiosClient.patch(ENDPOINT.UPDATE_KIT_DELIVERY_STATUS(id), {}, {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating Kit Delivery status with ID ${id}:`, error);
    throw error;
  }
}; 

// Lấy ExRequest theo id
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