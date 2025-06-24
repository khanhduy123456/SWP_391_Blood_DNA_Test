import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_BLOG_POSTS: "/BlogPost",
  CREATE_BLOG_POSTS: "/BlogPost",
};

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  createAt: string;
}

interface PagedBlogPostResponse {
  items: BlogPost[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface CreateBlogPostRequest {
  title: string;
  content: string;
  summary: string;
  author: string;
}

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_BLOG_POSTS);
    return response.data as BlogPost[];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;
  }
};

export const getPagedBlogPosts = async (pageNumber: number, pageSize: number, sortOrder?: 'desc' | 'asc'): Promise<PagedBlogPostResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { pageNumber, pageSize };
    if (sortOrder) params.sortOrder = sortOrder;
    const response = await axiosClient.get(ENDPOINT.GET_ALL_BLOG_POSTS, {
      params,
    });
    return response.data as PagedBlogPostResponse;
  } catch (error) {
    console.error("Error fetching paged blog posts:", error);
    throw error;
  }
};

export const createBlogPost = async (data: CreateBlogPostRequest): Promise<BlogPost> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_BLOG_POSTS, data);
    return response.data as BlogPost;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

export const updateBlogPost = async (
  blogId: number,
  data: { title: string; content: string }
): Promise<{ blogId: number; title: string }> => {
  try {
    const response = await axiosClient.put(`/BlogPost/${blogId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
};

export const deleteBlogPost = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`/BlogPost/${id}`);
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
};
