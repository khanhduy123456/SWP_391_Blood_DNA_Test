import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_KIT_DELIVERIES: "/KitDelivery",
  CREATE_KIT_DELIVERY: "/KitDelivery",
  DELETE_KIT_DELIVERY: (id: number) => `/KitDelivery/${id}`,
  GET_PAGED_KIT_DELIVERIES: (pageNumber: number = 1, pageSize: number = 10) =>
    `/KitDelivery/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,

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
  pageSize: number = 10
): Promise<KitDelivery[]> => {
  try {
    const url = ENDPOINT.GET_PAGED_KIT_DELIVERIES(pageNumber, pageSize);
    console.log(`Gọi API phân trang: ${url}`);

    const response = await axiosClient.get(url, {
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
    console.error("Lỗi khi lấy danh sách KitDeliveries (paged):", error);
    throw new Error("Không thể lấy danh sách KitDeliveries (paged)");
  }
};

export interface CreateKitDeliveryDto {
    requestId: number;
    kitId: number;
    kittype: string;
  }
  
  export const createKitDelivery = async (
    data: CreateKitDeliveryDto
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