import axiosClient from "@/shared/lib/axiosClient";

export interface PaymentResponse {
  id: number;
  requestId: number;
  amount: number;
  paymentMethod: string;
  statusId: string;
  createAt: string;
  updateAt: string;
}

// Thêm interface cho payment detail
export interface PaymentDetail {
  paymentId: number;
  requestId: number;
  amount: number;
  statusId: string;
  transactionNo: string;
  responseCode: string;
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
  serviceName: string;
  sampleMethodName: string;
}

export interface PagedPaymentResponse {
  items: PaymentResponse[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export const getPaymentsByUserId = async (
  userId: number,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<PagedPaymentResponse> => {
  try {
    console.log(`Calling Payment API for user ${userId}, page ${pageNumber}, size ${pageSize}`);
    
    const response = await axiosClient.get(
      `/Payment/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        timeout: 10000, // 10 giây timeout
      }
    );
    
    console.log('Payment API response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Lỗi khi lấy danh sách payments:", error);
    
    // Kiểm tra nếu là AxiosError
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      console.error("Error status:", axiosError.response?.status);
      console.error("Error message:", axiosError.response?.data);
      
      // Nếu API trả về 404 với message "Không có payment"
      if (axiosError.response?.status === 404) {
        const errorMessage = axiosError.response?.data?.message;
        if (errorMessage && errorMessage.includes("Không có payment")) {
          console.log("User chưa có payment nào, trả về danh sách rỗng");
          return {
            items: [],
            totalPages: 0,
            totalItems: 0,
            currentPage: pageNumber,
            pageSize: pageSize
          };
        } else {
          console.warn("API endpoint không tồn tại hoặc lỗi khác");
          throw new Error("API thanh toán không tồn tại. Vui lòng liên hệ admin.");
        }
      }
    }
    
    // Nếu lỗi khác, throw error để component xử lý
    throw new Error("Không thể tải lịch sử thanh toán. Vui lòng thử lại sau.");
  }
};

// Thêm API để lấy chi tiết payment
export const getPaymentDetail = async (
  paymentId: number
): Promise<PaymentDetail> => {
  try {
    console.log(`Calling Payment Detail API for payment ${paymentId}`);
    
    const response = await axiosClient.get(
      `/Payment/details/${paymentId}`,
      {
        timeout: 10000, // 10 giây timeout
      }
    );
    
    console.log('Payment Detail API response:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Lỗi khi lấy chi tiết payment:", error);
    
    // Kiểm tra nếu là AxiosError
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } };
      console.error("Error status:", axiosError.response?.status);
      console.error("Error message:", axiosError.response?.data);
      
      if (axiosError.response?.status === 404) {
        throw new Error("Không tìm thấy thông tin thanh toán.");
      }
    }
    
    throw new Error("Không thể lấy thông tin chi tiết thanh toán. Vui lòng thử lại sau.");
  }
}; 