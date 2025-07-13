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

// Lấy staffId dựa trên userId - thử nhiều endpoint
export const getStaffIdByUserId = async (
  userId: number
): Promise<StaffId> => {
  const endpoints = [
    ENDPOINT.GET_STAFF_ID_BY_USER_ID(userId),
    ENDPOINT.GET_STAFF_BY_USER_ID(userId),
    ENDPOINT.GET_STAFF_PROFILE(userId),
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Thử endpoint: ${endpoint}`);
      const response = await axiosClient.get(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      // Kiểm tra response format
      if (response.data && typeof response.data === 'object') {
        // Nếu response có staffId trực tiếp
        if (response.data.staffId) {
          return { staffId: response.data.staffId };
        }
        // Nếu response là array và có phần tử đầu tiên
        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstItem = response.data[0];
          if (firstItem.staffId) {
            return { staffId: firstItem.staffId };
          }
        }
        // Nếu response có id field
        if (response.data.id) {
          return { staffId: response.data.id };
        }
      }

      console.log('Response data:', response.data);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number; data?: unknown } };
        console.log(`Endpoint ${endpoint} failed:`, axiosError.response?.status, axiosError.response?.data);
      } else {
        console.log(`Endpoint ${endpoint} failed:`, error);
      }
      continue; // Thử endpoint tiếp theo
    }
  }

  // Nếu tất cả endpoint đều thất bại, throw error
  throw new Error('Không thể tìm thấy thông tin staff cho userId này');
};
