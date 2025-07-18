import axiosClient from "@/shared/lib/axiosClient";
import { isAxiosError } from "axios";

const ENDPOINT = {
    GET_STAFF: "/account/account/3",
};

export interface Staff {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    roleId: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface StaffResponse {
    items: Staff[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export const getStaffList = async () => {
    try {
        const response = await axiosClient.get<StaffResponse>(ENDPOINT.GET_STAFF, {
            params: {
                pageNumber: 1,
                pageSize: 1000, // Đặt pageSize lớn để lấy toàn bộ dữ liệu
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data.items; // Chỉ trả về danh sách nhân viên
    } catch (error) {
        if (isAxiosError(error)) {
            const serverMessage =
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Lấy danh sách nhân viên thất bại. Vui lòng thử lại.";
            throw new Error(serverMessage);
        } else {
            throw new Error("Lỗi không xác định khi lấy danh sách nhân viên.");
        }
    }
};