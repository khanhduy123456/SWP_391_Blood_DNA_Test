import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  // Thử các endpoint khác nhau
  GET_STAFF_ID_BY_USER_ID: (userId: number) => `/Staff/staffid/byuserid/${userId}`,
  GET_STAFF_BY_USER_ID: (userId: number) => `/Staff/user/${userId}`,
  GET_STAFF_PROFILE: (userId: number) => `/Staff/profile/${userId}`,
};

export interface StaffId {
  staffId: number;
}

export interface StaffProfile {
  staffId: number;
  userId: number;
  name?: string;
  email?: string;
}

// Lấy staffId dựa trên userId
export const getStaffIdByUserId = async (
  userId: number
): Promise<StaffId> => {
  try {
    console.log(`Gọi API: ${ENDPOINT.GET_STAFF_ID_BY_USER_ID(userId)}`);
    const response = await axiosClient.get(ENDPOINT.GET_STAFF_ID_BY_USER_ID(userId), {
      headers: {
        Accept: "*/*",
      },
    });

    // API trả về trực tiếp staffId (number)
    if (typeof response.data === 'number') {
      return { staffId: response.data };
    }

    // Fallback: nếu response là object có staffId
    if (response.data && typeof response.data === 'object' && response.data.staffId) {
      return { staffId: response.data.staffId };
    }

    console.log('Response data:', response.data);
    throw new Error('Response format không hợp lệ');
    
  } catch (error: unknown) {
    console.error('Lỗi khi lấy staffId:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: unknown } };
      console.log(`API failed:`, axiosError.response?.status, axiosError.response?.data);
    }
    throw new Error('Không thể tìm thấy thông tin staff cho userId này');
  }
};
