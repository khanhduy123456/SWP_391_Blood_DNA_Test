import axiosClient from "@/shared/lib/axiosClient";
import type { Kit, PagedKitResponse } from "../types/kit";


const ENDPOINT = {
  GET_ALL_KITS: "/Kit",
  PAGINATION_KITS: "/Kit/paged",
  CREATE_KIT: "/Kit",
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