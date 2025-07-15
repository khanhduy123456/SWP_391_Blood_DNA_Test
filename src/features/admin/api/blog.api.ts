import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  GET_ALL_BLOG: "/BlogPost",
  GET_BLOG_BY_ID: (id: number) => `/BlogPost/${id}`,
  CREATE_BLOG: "/BlogPost",
  UPDATE_BLOG: (id: number) => `/BlogPost/${id}`,
  DELETE_BLOG: (id: number) => `/BlogPost/${id}`,

};

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  isPublished: boolean;
  createAt: string;
  updateAt?: string;
  imageUrl?: string;
  tags?: string[];
  viewCount?: number;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  isPublished: boolean;
  imageUrl?: string;
  tags?: string[];
}

export interface UpdateBlogPostRequest {
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  isPublished: boolean;
  imageUrl?: string;
  tags?: string[];
}

export interface BlogPostResponse {
  blogId: number;
  title: string;
  author: string;
  summary: string;
  category: string;
  isPublished: boolean;
}

// Lấy toàn bộ blog (cho admin)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_ALL_BLOG, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data as BlogPost[];
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    throw error;
  }
};

// Lấy blog theo ID
export const getBlogPostById = async (id: number): Promise<BlogPost> => {
  try {
    const response = await axiosClient.get(ENDPOINT.GET_BLOG_BY_ID(id), {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error);
    throw error;
  }
};

// Tạo blog mới
export const createBlogPost = async (
  data: CreateBlogPostRequest
): Promise<BlogPostResponse> => {
  try {
    const response = await axiosClient.post(ENDPOINT.CREATE_BLOG, data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data as BlogPostResponse;
  } catch (error) {
    console.error("Error creating blog post:", error);
    throw error;
  }
};

// Cập nhật blog theo ID
export const updateBlogPost = async (
  blogId: number,
  data: UpdateBlogPostRequest
): Promise<BlogPostResponse> => {
  try {
    const response = await axiosClient.put(ENDPOINT.UPDATE_BLOG(blogId), data, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return response.data as BlogPostResponse;
  } catch (error) {
    console.error(`Error updating blog post ${blogId}:`, error);
    throw error;
  }
};

// Xoá blog theo ID
export const deleteBlogPost = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(ENDPOINT.DELETE_BLOG(id));
  } catch (error) {
    console.error(`Error deleting blog post ${id}:`, error);
    throw error;
  }
};
