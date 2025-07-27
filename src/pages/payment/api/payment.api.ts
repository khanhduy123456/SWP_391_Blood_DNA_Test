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

// ✅ Tạo thanh toán VNPay với retry mechanism
export const createPayment = async (
  payload: CreatePaymentPayload
): Promise<{ paymentUrl: string }> => {
  const maxRetries = 3;
  const timeout = 120000; // 2 phút
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      console.log(`Calling createPayment with payload (attempt ${attempts + 1}/${maxRetries}):`, payload);
      console.log('Endpoint:', ENDPOINT.CREATE_PAYMENT);
      
      const res = await axiosClient.post(ENDPOINT.CREATE_PAYMENT, payload, {
        timeout,
      });
      console.log('Payment API response:', res);
      console.log('Payment API data:', res.data);
      
      return res.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      attempts++;
      console.error(`Payment attempt ${attempts} failed:`, error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error code:", error.code);
      
      // Nếu đã thử hết số lần, throw error
      if (attempts >= maxRetries) {
        // Xử lý các loại lỗi cụ thể
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          throw new Error("Server đang xử lý thanh toán, vui lòng chờ thêm 2-3 phút và thử lại.");
        }
        
        if (error.response?.status === 504) {
          throw new Error("Server đang bị quá tải, vui lòng thử lại sau 3-5 phút.");
        }
        
        if (error.response?.status === 404) {
          throw new Error("API thanh toán chưa được implement. Vui lòng liên hệ admin.");
        }
        
        throw new Error("Không thể khởi tạo thanh toán sau nhiều lần thử.");
      }
      
      // Nếu chưa hết số lần thử, chờ một chút rồi thử lại
      console.log(`Retrying payment in ${attempts * 2} seconds...`);
      await new Promise(resolve => setTimeout(resolve, attempts * 2000)); // Tăng delay theo số lần thử
    }
  }
  
  throw new Error("Không thể khởi tạo thanh toán sau nhiều lần thử.");
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
