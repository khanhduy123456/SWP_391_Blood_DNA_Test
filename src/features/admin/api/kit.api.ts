import axiosClient from "@/shared/lib/axiosClient";
import type { Kit, PagedKitResponse } from "../types/kit";


const ENDPOINT = {
  GET_ALL_KITS: "/Kit",
  PAGINATION_KITS: "/Kit/paged",
  CREATE_KIT: "/Kit",
  UPDATE_KIT: (id: number) => `/Kit/${id}`, 
  DELETE_KIT: (id: number) => `/Kit/${id}`,
};

export const getAllKits = async (): Promise<Kit[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_KITS, {
      headers: {
        Accept: "text/plain",
      },
    });

    return response.data as Kit[];
  } catch (error) {
    console.error("Error fetching Kits:", error);
    throw error;
  }
};
export const getPagedKits = async (pageNumber: number, pageSize: number): Promise<PagedKitResponse> => {
  try {
    const response = await axiosClient.get(ENDPOINT.PAGINATION_KITS, {
      params: {
        pageNumber,
        pageSize,
      },
      headers: {
        Accept: "*/*",
      },
    });

    return response.data as PagedKitResponse;
  } catch (error) {
    console.error("Error fetching paged Kits:", error);
    throw error;
  }
};

export const createKit = async (kitData: { name: string; description: string }): Promise<Kit> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_KIT, kitData, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });

    return response.data as Kit;
  } catch (error) {
    console.error("Error creating Kit:", error);
    throw error;
  }
};

export const updateKit = async (
  id: number,
  kitData: { name: string; description: string }
): Promise<string> => {
  try {
    const response = await axiosClient.put(ENDPOINT.UPDATE_KIT(id), kitData, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });

    return response.data; 
  } catch (error) {
    console.error(`Error updating Kit with ID ${id}:`, error);
    throw error;
  }
};



export const deleteKit = async (id: number): Promise<void> => {
  try {
    const response = await axiosClient.delete(ENDPOINT.DELETE_KIT(id), {
      headers: {
        Accept: "*/*",
      },
    });

    if (response.status !== 200) {
      throw new Error("Xoá Kit thất bại.");
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Lỗi khi xoá Kit:", error.response?.data || error.message);
    throw error;
  }
};