import axiosClient from "@/shared/lib/axiosClient";

export interface Account {
  userId: number;
  email: string;
  role: string;
  status: boolean;
}
// Kiểu dữ liệu cho user profile
export interface UserProfile {
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Kiểu dữ liệu cho cập nhật profile
export interface UpdateUserProfile {
  name: string;
  phone: string;
  address: string;
}

export interface RegisterStaff{
  email: string;
  password: string;
  roleId: number; // 1 = Manager, 2 = Staff
}
const ENDPOINT = {
  GET_ALL_USERS: "/account/accountall",
  UPDATE_STATUS_USER: (userId: number) => `/account/${userId}/status`,
  REGISTER_ADMIN: "/account/register-admin",
  GET_USER_BY_ID: (userId: number) => `/account/${userId}`,
  UPDATE_USER_PROFILE: (userId: number) => `/account/${userId}/profile`,
};

export const getAllUsers = async (): Promise<Account[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_USERS, {
      headers: { Accept: "text/plain" },
    });
    return response.data as Account[];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const toggleUserStatus = async (userId: number): Promise<void> => {
  try {
    await axiosClient.patch(ENDPOINT.UPDATE_STATUS_USER(userId), {
      headers: { Accept: "text/plain" },
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    throw error;
  }
};

export const registerAdmin = async (payload: RegisterStaff): Promise<void> => {
  try {
    await axiosClient.post(ENDPOINT.REGISTER_ADMIN, payload, {
      headers: { Accept: "text/plain" },
    });
  } catch (error) {
    console.error("Error registering admin/staff:", error);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<UserProfile> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_USER_BY_ID(userId), {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userId: number,
  payload: UpdateUserProfile
): Promise<void> => {
  try {
    await axiosClient.patch(
      ENDPOINT.UPDATE_USER_PROFILE(userId),
      payload,
      {
        headers: {
          Accept: "text/plain",
        },
      }
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};