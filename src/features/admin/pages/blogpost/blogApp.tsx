import React, { useState, useEffect } from 'react';
import { renderAdminBlogPost } from './blogpost';
import { 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  type BlogPost as ApiBlogPost,
  type CreateBlogPostRequest 
} from '@/features/admin/api/blog.api';

const BlogApp: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<ApiBlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<ApiBlogPost | null>(null);
  const [previewPost, setPreviewPost] = useState<ApiBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBlogPostRequest>({
    title: '',
    content: '',
    summary: '',
    author: '',
    category: '',
    isPublished: true // Luôn set thành true như đã thay đổi trong blogpost.tsx
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await getAllBlogPosts();
      
      // Check for duplicate IDs
      const ids = posts.map(p => p.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('Duplicate blog post IDs found:', ids);
        // Remove duplicates
        const uniquePosts = posts.filter((post, index, self) => 
          index === self.findIndex(p => p.id === post.id)
        );
        console.log('Removed duplicates, keeping', uniquePosts.length, 'posts');
        setBlogPosts(uniquePosts);
      } else {
        setBlogPosts(posts);
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBlogPost = async (data: CreateBlogPostRequest): Promise<ApiBlogPost | null> => {
    try {
      setIsLoading(true);
      const result = await createBlogPost(data);
      if (result) {
        const newPost: ApiBlogPost = {
          id: result.blogId,
          title: result.title,
          content: data.content,
          summary: data.summary,
          author: result.author,
          category: result.category,
          isPublished: result.isPublished,
          createAt: new Date().toISOString(),
          viewCount: 0
        };
        
        // Check if post with same ID already exists
        const existingPost = blogPosts.find(p => p.id === newPost.id);
        if (existingPost) {
          console.warn('Blog post with ID', newPost.id, 'already exists');
          return null;
        }
        
        setBlogPosts(prev => [newPost, ...prev]);
        return newPost;
      }
      return null;
    } catch (error) {
      console.error('Error creating blog post:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBlogPost = async (id: number, data: CreateBlogPostRequest): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await updateBlogPost(id, data);
      if (result) {
        setBlogPosts(prev => prev.map(post => 
          post.id === id 
            ? { 
                ...post, 
                title: data.title,
                content: data.content,
                summary: data.summary,
                author: data.author,
                category: data.category,
                isPublished: data.isPublished,
                updateAt: new Date().toISOString()
              }
            : post
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBlogPost = async (id: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      await deleteBlogPost(id);
      setBlogPosts(prev => prev.filter(post => post.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return renderAdminBlogPost({
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
    previewPost,
    setPreviewPost,
  });
};

export default BlogApp;
