import axiosClient from "@/shared/lib/axiosClient";
import type { PagedSampleResponse, SampleMethod } from "../types/method";


const ENDPOINT = {
  GET_ALL_SAMPLES: "/SampleMethod",
  PAGINATION_SAMPlES: "/SampleMethod/paged",
  CREATE_SAMPLES: "/SampleMethod",
};

export const getAllSampleMethods = async (): Promise<SampleMethod[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_SAMPLES, {
      headers: {
        Accept: "text/plain",
      },
    });

    return response.data as SampleMethod[];
  } catch (error) {
    console.error("Error fetching Sample Methods:", error);
    throw error;
  }
};
export const getPagedSampleMethods = async (pageNumber: number, pageSize: number): Promise<PagedSampleResponse> => {
  try {
    const response = await axiosClient.get(ENDPOINT.PAGINATION_SAMPlES, {
      params: {
        pageNumber,
        pageSize,
      },
      headers: {
        Accept: "*/*",
      },
    });

    return response.data as PagedSampleResponse;
  } catch (error) {
    console.error("Error fetching paged Sample Methods:", error);
    throw error;
  }
};
export const createSampleMethod = async (SampleMethodData: { name: string; description: string }): Promise<SampleMethod> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_SAMPLES, SampleMethodData, {
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json",
      },
    });

    return response.data as SampleMethod;
  } catch (error) {
    console.error("Error creating Sample Method:", error);
    throw error;
  }
};