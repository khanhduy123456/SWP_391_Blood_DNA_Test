import axiosClient from "@/shared/lib/axiosClient";
import type { Kit } from "../types/kit";


const ENDPOINT = {
  GET_ALL_KITS: "/Kit",
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
