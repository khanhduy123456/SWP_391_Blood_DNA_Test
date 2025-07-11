import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  CREATE_EX_REQUEST: "/ExRequest",
};

export interface CreateExRequest {
  userId: number;
  serviceId: number;
  priorityId: number;
  sampleMethodId: number;
  appointmentTime: string; // ISO string (e.g., "2025-07-10T09:25:00.355Z")
}

export interface ExRequestResponse {
  id: number;
  userId: number;
  serviceId: number;
  priorityId: number;
  sampleMethodId: number;
  appointmentTime: string;
  createdAt: string;
}

export const createExRequest = async (
  data: CreateExRequest,
): Promise<ExRequestResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_EX_REQUEST, data);
    return response.data;
  } catch (error) {
    console.error("Error creating ExRequest:", error);
    throw error;
  }
};
