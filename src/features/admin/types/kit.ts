// types/kit.ts
export interface Kit {
  id: number;
  name: string;
  description: string;
  createAt: string;
  updateAt: string;
}
export interface PagedKitResponse {
  items: Kit[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}