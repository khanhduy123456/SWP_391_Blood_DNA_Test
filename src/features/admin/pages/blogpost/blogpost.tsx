import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { Search, Plus, Edit, Trash2, Settings } from 'lucide-react';

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

interface AdminBlogPostProps {
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  showCreateForm: boolean;
  setShowCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  editingPost: BlogPost | null;
  setEditingPost: React.Dispatch<React.SetStateAction<BlogPost | null>>;
  formData: CreateBlogRequest;
  setFormData: React.Dispatch<React.SetStateAction<CreateBlogRequest>>;
  isLoading: boolean;
  updateBlogPost: (id: number, data: CreateBlogRequest) => Promise<boolean>;
  deleteBlogPost: (id: number) => Promise<boolean>;
  createBlogPost: (data: CreateBlogRequest) => Promise<BlogPost | null>;
}

export const renderAdminBlogPost = ({
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
  updateBlogPost,
  deleteBlogPost,
  createBlogPost,
}: AdminBlogPostProps) => {
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.summary.trim() || !formData.author.trim()) return;

    if (editingPost) {
      const success = await updateBlogPost(editingPost.id, formData);
      if (success) {
        setEditingPost(null);
        setFormData({ title: '', content: '', summary: '', author: '' });
        setShowCreateForm(false);
      }
    } else {
      const result = await createBlogPost(formData);
      if (result) {
        setBlogPosts(prev => [{ ...result, category: 'Mới', isPublished: true }, ...prev]);
        setFormData({ title: '', content: '', summary: '', author: '' });
        setShowCreateForm(false);
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      summary: post.summary || '',
      author: post.author || ''
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', summary: '', author: '' });
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Settings size={24} />
              <h1 className="text-xl font-bold">Admin Dashboard - Quản Lý Blog</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Quản Lý Bài Viết</h2>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                <Plus size={16} className="mr-2" />
                Tạo bài viết mới
              </Button>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {showCreateForm && (
              <Card className="mb-6 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">
                    {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Tiêu đề</label>
                      <Input
                        value={formData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Nhập tiêu đề bài viết..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tóm tắt</label>
                      <Input
                        value={formData.summary}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Nhập tóm tắt bài viết..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tác giả</label>
                      <Input
                        value={formData.author}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Nhập tên tác giả..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Nội dung (Markdown supported)</label>
                      <Textarea
                        value={formData.content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Nhập nội dung bài viết..."
                        rows={10}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : (editingPost ? 'Cập nhật' : 'Tạo bài viết')}
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Hủy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          <span>ID: {post.id}</span>
                          <span>{new Date(post.createAt).toLocaleDateString()}</span>
                          <span>{post.author}</span>
                          <Badge variant={post.isPublished ? "default" : "secondary"}>
                            {post.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                          <Edit size={14} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteBlogPost(post.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-2">
                      {post.summary?.substring(0, 150) ?? ""}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📊 Thống kê</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tổng bài viết:</span>
                    <span className="font-bold">{blogPosts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Đã xuất bản:</span>
                    <span className="font-bold text-green-600">
                      {blogPosts.filter(p => p.isPublished).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bản nháp:</span>
                    <span className="font-bold text-orange-600">
                      {blogPosts.filter(p => !p.isPublished).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};