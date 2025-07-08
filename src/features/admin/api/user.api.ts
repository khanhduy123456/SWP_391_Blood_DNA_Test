import axiosClient from "@/shared/lib/axiosClient";

export interface Account {
  userId: number;
  email: string;
  role: string;
  status: boolean;
}

const ENDPOINT = {
  GET_ALL_USERS: "/account/accountall",
  UPDATE_STATUS_USER: (userId: number) => `/account/${userId}/status`,
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