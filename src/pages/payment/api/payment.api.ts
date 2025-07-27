// services/paymentService.ts
import axiosClient from "@/shared/lib/axiosClient";

// ==== ENDPOINTS ====
const ENDPOINT = {
  CREATE_PAYMENT: "/Payment/vnpay",
  PAYMENT_RETURN: "/Payment/payment-return",
  GET_BY_USER: (userId: number, page?: number, size?: number) =>
    `/Payment/user/${userId}${
      page && size ? `?pageNumber=${page}&pageSize=${size}` : ""
    }`,
  GET_DETAIL: (paymentId: number) => `/Payment/details/${paymentId}`,
};

// ==== TYPES ====
export interface CreatePaymentPayload {
  userId: number;
  requestId: number;
  amount: number;
  orderInfo: string;
}

export interface Payment {
  id: number;
  userId: number;
  requestId: number;
  amount: number;
  orderInfo: string;
  paymentStatus: string;
  transactionId?: string;
  createAt: string;
}

export interface PaymentDetail extends Payment {
  serviceName: string;
  sampleMethodName: string;
}

export interface PagedPaymentResponse {
  items: Payment[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// ==== API CALLS ====

// ✅ Tạo thanh toán VNPay
export const createPayment = async (
  payload: CreatePaymentPayload
): Promise<{ paymentUrl: string }> => {
  try {
    console.log('Calling createPayment with payload:', payload);
    console.log('Endpoint:', ENDPOINT.CREATE_PAYMENT);
    
    // Tăng timeout cho payment API
    const res = await axiosClient.post(ENDPOINT.CREATE_PAYMENT, payload, {
      timeout: 30000, // 30 giây
    });
    console.log('Payment API response:', res);
    console.log('Payment API data:', res.data);
    
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi tạo thanh toán:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    console.error("Error status:", error.response?.status);
    console.error("Error code:", error.code);
    
    // Xử lý các loại lỗi cụ thể
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      throw new Error("Server đang bận, vui lòng thử lại sau.");
    }
    
    if (error.response?.status === 504) {
      throw new Error("Server đang bị quá tải, vui lòng thử lại sau.");
    }
    
    if (error.response?.status === 404) {
      throw new Error("API thanh toán chưa được implement. Vui lòng liên hệ admin.");
    }
    
    throw new Error("Không thể khởi tạo thanh toán.");
  }
};

// ✅ Xử lý callback từ VNPay - Gọi API BE để xác nhận và lưu payment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlePaymentReturn = async (): Promise<any> => {
  try {
    console.log('Calling BE API to confirm payment with params:', window.location.search);
    
    const res = await axiosClient.get(
      `${ENDPOINT.PAYMENT_RETURN}${window.location.search}`
    );
    
    console.log('BE API response:', res.data);
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi xử lý phản hồi VNPay:", error);
    console.error("Error response:", error.response?.data);
    throw new Error("Không thể xác nhận payment với server.");
  }
};

// ✅ Lấy danh sách thanh toán theo userId
export const getPaymentsByUser = async (
  userId: number,
  page?: number,
  pageSize?: number
): Promise<PagedPaymentResponse> => {
  try {
    const res = await axiosClient.get(
      ENDPOINT.GET_BY_USER(userId, page, pageSize)
    );
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách thanh toán:", error);
    throw new Error("Không thể tải lịch sử thanh toán.");
  }
};

// ✅ Lấy chi tiết thanh toán
export const getPaymentDetail = async (
  paymentId: number
): Promise<PaymentDetail> => {
  try {
    const res = await axiosClient.get(ENDPOINT.GET_DETAIL(paymentId));
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi lấy chi tiết thanh toán:", error);
    throw new Error("Không thể lấy thông tin chi tiết thanh toán.");
  }
};
