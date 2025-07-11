// api/account.api.ts
import axiosClient from "@/shared/lib/axiosClient";
import type { UserAccount } from "../types/userAccount";

const ENDPOINT = {
  GET_USER_BY_ID: (userId: number) => `/account/${userId}`,
  UPDATE_PROFILE: (userId: number) => `/account/${userId}/profile`,
};

export const getUserById = async (userId: number): Promise<UserAccount> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_USER_BY_ID(userId), {
      headers: {
        Accept: "text/plain",
      },
    });
    return response.data as UserAccount;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin user:", error.response?.data || error.message);
    throw error;
  }
};
export interface UpdateUserProfilePayload {
    name: string;
    phone: string;
    address: string;
  }
  
  export interface UpdateUserProfileResponse {
    userId: number;
    name: string;
    phone: string;
    address: string;
    updatedAt: string;
  }
  export const updateUserProfile = async (
    userId: number,
    data: UpdateUserProfilePayload
  ): Promise<UpdateUserProfileResponse> => {
    try {
      const response = await axiosClient.patch(
        ENDPOINT.UPDATE_PROFILE(userId),
        data,
        {
          headers: {
            Accept: "text/plain",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Lỗi khi cập nhật profile:", error.response?.data || error.message);
      throw error;
    }
  };
    