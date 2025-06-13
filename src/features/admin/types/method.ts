export interface SampleMethod {
  id: number;
  name: string;
  description: string;
  createAt: string;
  updateAt: string;
}
export interface PagedSampleResponse {
  items: SampleMethod[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}