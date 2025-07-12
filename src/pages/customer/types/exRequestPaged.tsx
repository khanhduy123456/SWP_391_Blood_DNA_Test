export interface ExRequestResponse {
    id: number;
    userId: number;
    serviceId: number;
    priorityId: number;
    sampleMethodId: number;
    statusId: string;
    statusName: string;
    appointmentTime: string; // ISO string
    createAt: string; // ISO string
    updateAt: string; // ISO string
    staffId: number;
  }
  
  export interface PagedExRequestResponse {
    items: ExRequestResponse[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }