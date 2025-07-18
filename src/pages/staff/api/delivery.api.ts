import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_KIT_DELIVERIES: "/KitDelivery",
  CREATE_KIT_DELIVERY: "/KitDelivery",
  UPDATE_KIT_DELIVERY: (id: number) => `/KitDelivery/${id}`,
  DELETE_KIT_DELIVERY: (id: number) => `/KitDelivery/${id}`,
  GET_PAGED_KIT_DELIVERIES: (pageNumber: number = 1, pageSize: number = 10) =>
    `/KitDelivery/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,
  UPDATE_KIT_DELIVERY_STATUS: (id: number) => `/KitDelivery/${id}/status`,
  GET_EX_REQUESTS_BY_STAFF: (staffId: number) => `/ExRequest/staff/${staffId}`,
  GET_KIT_DELIVERY_BY_REQUEST_ID: (requestId: number) =>
    `/KitDelivery/by-request/${requestId}`,
};

export interface KitDelivery {
  id: number;
  requestId: number;
  kitId: number;
  sentAt: string;
  receivedAt: string;
  statusId: string;
  kitType: string;
  createAt: string;
  updateAt: string;
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

export interface ExRequest {
  id: number;
  userId: number;
  userName: string;
  serviceId: number;
  serviceName: string;
  priorityId: number;
  sampleMethodId: number;
  sampleMethodName: string;
  statusId: string;
  statusName: string;
  appointmentTime: string;
  createAt: string;
  updateAt: string;
  staffId: number;
  staffName: string;
}

// Lấy toàn bộ kit deliveries (không phân trang)
export const getAllKitDeliveries = async (): Promise<KitDelivery[]> => {
  try {
    console.log(`Gọi API: ${ENDPOINT.GET_ALL_KIT_DELIVERIES}`);
    const response = await axiosClient.get(ENDPOINT.GET_ALL_KIT_DELIVERIES, {
      headers: {
        Accept: "*/*",
      },
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.log("Dữ liệu trả về không hợp lệ:", response.data);
    throw new Error("Response format không hợp lệ");
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách KitDeliveries:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể lấy danh sách KitDeliveries");
  }
};

// Lấy danh sách kit deliveries có phân trang
export const getPagedKitDeliveries = async (
  pageNumber: number = 1,
  pageSize: number = 10,
  order?: 'desc' | 'asc',
  searchTerm?: string
): Promise<PagedKitDeliveryResponse> => {
  try {
    let url = ENDPOINT.GET_PAGED_KIT_DELIVERIES(pageNumber, pageSize);
    
    const params = new URLSearchParams();
    if (order) {
      params.append('order', order);
    }
    if (searchTerm) {
      params.append('searchTerm', searchTerm);
    }
    
    if (params.toString()) {
      url += `&${params.toString()}`;
    }
    
    console.log(`Gọi API phân trang: ${url}`);

    const response = await axiosClient.get(url, {
      headers: {
        Accept: "*/*",
      },
    });

    return response.data;
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách KitDeliveries (paged):", error);
    throw new Error("Không thể lấy danh sách KitDeliveries (paged)");
  }
};

export interface CreateKitDelivery {
  requestId: number;
  kitId: number;
  kitType: string;
}

export interface UpdateKitDelivery {
  kitId: number;
  kitType: string;
  statusId: string;
}

export const createKitDelivery = async (
  data: CreateKitDelivery
): Promise<KitDelivery> => {
  try {
    console.log("Gọi API tạo KitDelivery:", data);

    const response = await axiosClient.post(ENDPOINT.CREATE_KIT_DELIVERY, data, {
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
    console.error("Lỗi khi tạo KitDelivery:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể tạo mới KitDelivery");
  }
};

export const updateKitDelivery = async (
  id: number,
  data: UpdateKitDelivery
): Promise<KitDelivery> => {
  try {
    console.log(`Gọi API cập nhật KitDelivery ID = ${id}:`, data);
    const response = await axiosClient.put(ENDPOINT.UPDATE_KIT_DELIVERY(id), data, {
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

export const deleteKitDeliveryById = async (id: number): Promise<void> => {
  try {
    console.log(`Gọi API xoá KitDelivery ID = ${id}`);
    const response = await axiosClient.delete(ENDPOINT.DELETE_KIT_DELIVERY(id), {
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status === 200) {
      console.log("Xoá thành công");
      return;
    }

    throw new Error(`Unexpected status code: ${response.status}`);
  } catch (error: unknown) {
    console.error("Lỗi khi xoá KitDelivery:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể xoá KitDelivery");
  }
};

// Cập nhật trạng thái kit delivery
export const updateKitDeliveryStatus = async (id: number): Promise<void> => {
  try {
    console.log(`Gọi API cập nhật trạng thái KitDelivery ID = ${id}`);
    const response = await axiosClient.patch(ENDPOINT.UPDATE_KIT_DELIVERY_STATUS(id), {}, {
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      console.log("Cập nhật trạng thái thành công");
      return;
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

// Lấy danh sách ExRequest theo staffId
export const getExRequestsByStaffId = async (staffId: number): Promise<ExRequest[]> => {
  try {
    console.log(`Gọi API: ${ENDPOINT.GET_EX_REQUESTS_BY_STAFF(staffId)}`);
    const response = await axiosClient.get(ENDPOINT.GET_EX_REQUESTS_BY_STAFF(staffId), {
      headers: {
        Accept: "application/json",
      },
    });

    if (Array.isArray(response.data)) {
      return response.data;
    }

    console.log("Dữ liệu trả về không hợp lệ:", response.data);
    throw new Error("Response format không hợp lệ");
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách ExRequest theo staffId:", error);
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log("Chi tiết lỗi:", axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error("Không thể lấy danh sách ExRequest");
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

export interface KitDelivery {
  id: number;
  requestId: number;
  kitId: number;
  sentAt: string;
  receivedAt: string;
  statusId: string;
  kitType: string;
}
export const getKitDeliveryByRequestId = async (
  requestId: number
): Promise<KitDelivery> => {
  try {
    const response = await axiosClient.get(
      ENDPOINT.GET_KIT_DELIVERY_BY_REQUEST_ID(requestId),
      {
        headers: {
          Accept: "*/*",
        },
      }
    );

    if (response.status === 200 && response.data) {
      return response.data as KitDelivery;
    }

    throw new Error(`Unexpected status code: ${response.status}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      `Lỗi khi lấy KitDelivery theo requestId ${requestId}:`,
      error.response?.data || error.message
    );
    throw error;
  }
};
