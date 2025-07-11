// types/exRequest.ts
export interface ExRequest {
    id: number;
    userId: number;
    serviceId: number;
    priorityId: number;
    sampleMethodId: number;
    statusId: string;
    appointmentTime: string;
    createAt: string;
    updateAt: string;
    staffId: number;
  }
  
  export interface PagedExRequestResponse {
    items: ExRequest[];
    pageNumber: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }
  