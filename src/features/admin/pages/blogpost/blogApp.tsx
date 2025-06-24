import React, { useState, useEffect } from 'react';
import { createBlogPost, deleteBlogPost, getAllBlogPosts, updateBlogPost } from '../../api/blog.api';
import { renderAdminBlogPost } from './blogpost';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  summary: string;
  author: string;
  createAt: string;
  category?: string;
  isPublished?: boolean;
}

interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  author: string;
}

const BlogApp: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<CreateBlogRequest>({
    title: '',
    content: '',
    summary: '',
    author: 'Current User', // Có thể lấy từ context auth
  });

  const mockBlogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Giá Xét Nghiệm ADN Làm Giấy Khai Sinh, Tòa Án, Di Dân Nước Ngoài",
      content: "Nội dung bài viết mẫu...",
      summary: "Dịch vụ xét nghiệm ADN chuyên nghiệp cho các mục đích pháp lý",
      author: "Admin",
      createAt: "2024-12-15T00:00:00.000Z",
      category: "Dịch vụ",
      isPublished: true
    },
  ];

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await getAllBlogPosts();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedPosts = posts.map((post: any) => ({
          ...post,
        //  category: post.category || 'Mới',
          isPublished: post.isPublished !== undefined ? post.isPublished : true
        }));
        setBlogPosts(formattedPosts);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết:', error);
        setBlogPosts(mockBlogPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleCreateBlogPost = async (data: CreateBlogRequest): Promise<BlogPost | null> => {
    setIsLoading(true);
    try {
      const newPost = await createBlogPost(data);
      if (newPost) {
        setBlogPosts(prev => [{ ...newPost, category: 'Mới', isPublished: true }, ...prev]);
        return newPost;
      }
      return null;
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlogPost = async (id: number, data: CreateBlogRequest): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await updateBlogPost(id, data);
      const success = !!result;
      if (success) {
        setBlogPosts(prev => prev.map(post => 
          post.id === id 
            ? { ...post, ...data, category: post.category || 'Mới', isPublished: true }
            : post
        ));
      }
      return success;
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await deleteBlogPost(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {renderAdminBlogPost({
        blogPosts,
        setBlogPosts,
        searchTerm,
        setSearchTerm,
        showCreateForm,
        setShowCreateForm,
        editingPost,
        setEditingPost,
        formData,
        setFormData,
        isLoading,
        updateBlogPost: handleUpdateBlogPost,
        deleteBlogPost: handleDeleteBlogPost,
        createBlogPost: handleCreateBlogPost,
      })}
    </div>
  );
};

export default BlogApp;