import axiosClient from "@/shared/lib/axiosClient";

export interface PaymentResponse {
  id: number;
  requestId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  createAt: string;
  updateAt: string;
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
  const response = await axiosClient.get(
    `/api/Payment/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
  );
  return response.data;
}; 