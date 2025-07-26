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
    
    const res = await axiosClient.post(ENDPOINT.CREATE_PAYMENT, payload);
    console.log('Payment API response:', res);
    console.log('Payment API data:', res.data);
    
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi tạo thanh toán:", error);
    console.error("Error response:", error.response);
    console.error("Error message:", error.message);
    throw new Error("Không thể khởi tạo thanh toán.");
  }
};

// ✅ Xử lý callback từ VNPay
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handlePaymentReturn = async (): Promise<any> => {
  try {
    const res = await axiosClient.get(
      `${ENDPOINT.PAYMENT_RETURN}${window.location.search}`
    );
    return res.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi xử lý phản hồi VNPay:", error);
    throw new Error("Không thể xử lý kết quả thanh toán.");
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
