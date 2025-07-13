import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Badge } from '@/shared/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { Search, Plus, Edit, Trash2, Settings, Eye, EyeOff, Calendar, User, Tag, Image, Save, X, ExternalLink } from 'lucide-react';

interface BlogPost {
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

interface CreateBlogRequest {
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  isPublished: boolean;
  imageUrl?: string;
  tags?: string[];
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
  previewPost?: BlogPost | null;
  setPreviewPost?: React.Dispatch<React.SetStateAction<BlogPost | null>>;
}

const CATEGORIES = [
  "Xét nghiệm ADN",
  "Hướng dẫn",
  "Tin tức y tế", 
  "Nghiên cứu khoa học",
  "Tư vấn",
  "Khác"
];

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
  previewPost,
  setPreviewPost,
}: AdminBlogPostProps) => {
  // Generate unique component ID
  const componentId = `blog-admin-${Date.now()}`;
  
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.summary.trim() || !formData.author.trim() || !formData.category) return;

    if (editingPost) {
      const success = await updateBlogPost(editingPost.id, formData);
      if (success) {
        setEditingPost(null);
        setFormData({ title: '', content: '', summary: '', author: '', category: '', isPublished: false });
        setShowCreateForm(false);
      }
    } else {
      const result = await createBlogPost(formData);
      if (result) {
        setBlogPosts(prev => [{ ...result, viewCount: 0 }, ...prev]);
        setFormData({ title: '', content: '', summary: '', author: '', category: '', isPublished: false });
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
      author: post.author || '',
      category: post.category || '',
      isPublished: post.isPublished || false,
      imageUrl: post.imageUrl || '',
      tags: post.tags || []
    });
    setShowCreateForm(true);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setFormData({ title: '', content: '', summary: '', author: '', category: '', isPublished: false });
  };

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ensure unique IDs for filtered posts
  const uniqueFilteredPosts = filteredPosts.filter((post, index, self) => 
    index === self.findIndex(p => p.id === post.id)
  );

  const publishedCount = blogPosts.filter(p => p.isPublished).length;
  const draftCount = blogPosts.filter(p => !p.isPublished).length;
  const totalViews = blogPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header với gradient */}
      <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Settings size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Quản Lý Blog & Tin Tức</h1>
                <p className="text-blue-100 text-sm">Hệ thống quản lý nội dung xét nghiệm ADN</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-blue-100">Tổng bài viết</div>
                <div className="text-2xl font-bold">{blogPosts.length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800">Danh sách bài viết</h2>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {uniqueFilteredPosts.length} bài viết
                </Badge>
              </div>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
                disabled={isLoading}
              >
                <Plus size={16} className="mr-2" />
                Tạo bài viết mới
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung, tác giả..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Create/Edit Form */}
            {showCreateForm && (
              <Card className="mb-6 border-2 border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-blue-700 flex items-center gap-2">
                    {editingPost ? <Edit size={20} /> : <Plus size={20} />}
                    {editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Tiêu đề bài viết *</label>
                      <Input
                        value={formData.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Nhập tiêu đề bài viết..."
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Tác giả *</label>
                      <Input
                        value={formData.author}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Nhập tên tác giả..."
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Danh mục *</label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                                                  {CATEGORIES.map((category, index) => (
                          <SelectItem key={`select-${category}-${index}`} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Tóm tắt *</label>
                      <Textarea
                        value={formData.summary}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, summary: e.target.value })}
                        placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                        rows={3}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">URL hình ảnh</label>
                      <div className="flex gap-2">
                        <Input
                          value={formData.imageUrl || ''}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, imageUrl: e.target.value })}
                          placeholder="https://example.com/image.jpg"
                          className="border-gray-200 focus:border-blue-500"
                        />
                        <Button variant="outline" size="sm" className="border-gray-200">
                          <Image size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-gray-700">Nội dung chi tiết *</label>
                      <Textarea
                        value={formData.content}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Nhập nội dung chi tiết bài viết (hỗ trợ Markdown)..."
                        rows={12}
                        className="border-gray-200 focus:border-blue-500 font-mono text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isPublished"
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked as boolean })}
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                          Xuất bản ngay
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      <Save size={16} className="mr-2" />
                      {isLoading ? 'Đang xử lý...' : (editingPost ? 'Cập nhật' : 'Tạo bài viết')}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="border-gray-300">
                      <X size={16} className="mr-2" />
                      Hủy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blog Posts List */}
            <div className="space-y-4">
              {uniqueFilteredPosts.map((post, index) => (
                <Card key={`${componentId}-post-${post.id}-${index}`} className="hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg text-gray-800">{post.title}</CardTitle>
                          <Badge variant={post.isPublished ? "default" : "secondary"} className={post.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                            {post.isPublished ? <Eye size={12} className="mr-1" /> : <EyeOff size={12} className="mr-1" />}
                            {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {post.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            <span>{post.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(post.createAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                          {post.viewCount !== undefined && (
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{post.viewCount} lượt xem</span>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 line-clamp-2 text-sm">
                          {post.summary || "Chưa có tóm tắt..."}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(post)} className="border-blue-200 text-blue-600 hover:bg-blue-50" title="Chỉnh sửa">
                          <Edit size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setPreviewPost?.(post)} 
                          className="border-purple-200 text-purple-600 hover:bg-purple-50" 
                          title="Xem trước"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => window.open(`/news/${post.id}`, '_blank')} 
                          className="border-green-200 text-green-600 hover:bg-green-50" 
                          title="Xem như Customer"
                        >
                          <ExternalLink size={14} />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteBlogPost(post.id)} className="bg-red-500 hover:bg-red-600" title="Xóa">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
              
              {uniqueFilteredPosts.length === 0 && (
                <Card className="text-center py-12">
                  <div className="text-gray-500">
                    <Search size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Không tìm thấy bài viết nào</p>
                    <p className="text-sm">Thử thay đổi từ khóa tìm kiếm hoặc tạo bài viết mới</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <Settings size={20} />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <div className="text-sm text-gray-600">Tổng bài viết</div>
                      <div className="text-2xl font-bold text-blue-600">{blogPosts.length}</div>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Settings size={20} className="text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <div className="text-sm text-gray-600">Đã xuất bản</div>
                      <div className="text-2xl font-bold text-green-600">{publishedCount}</div>
                    </div>
                    <div className="p-2 bg-green-100 rounded-full">
                      <Eye size={20} className="text-green-600" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <div className="text-sm text-gray-600">Bản nháp</div>
                      <div className="text-2xl font-bold text-orange-600">{draftCount}</div>
                    </div>
                    <div className="p-2 bg-orange-100 rounded-full">
                      <EyeOff size={20} className="text-orange-600" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <div>
                      <div className="text-sm text-gray-600">Tổng lượt xem</div>
                      <div className="text-2xl font-bold text-purple-600">{totalViews.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Eye size={20} className="text-purple-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag size={20} />
                  Danh mục
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {CATEGORIES.map((category, index) => {
                    const count = blogPosts.filter(p => p.category === category).length;
                    return (
                      <div key={`category-${category}-${index}`} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{category}</span>
                        <Badge variant="outline" className="text-xs">
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Xem trước bài viết</h2>
                  <p className="text-blue-100 text-sm">Cách bài viết sẽ hiển thị cho customer (có thể push ngay)</p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => setPreviewPost?.(null)}
                  className="text-white hover:bg-white/20"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {previewPost.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{previewPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{new Date(previewPost.createAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {previewPost.viewCount !== undefined && (
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{previewPost.viewCount} lượt xem</span>
                      </div>
                    )}
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">{previewPost.title}</h1>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">{previewPost.summary}</p>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                  {previewPost.content}
                </div>
              </div>

              {/* Article Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-500" />
                    <span className="text-gray-600">Danh mục:</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {previewPost.category}
                    </Badge>
                  </div>
                  <div className="text-gray-500 text-sm">
                    Cập nhật lần cuối: {new Date(previewPost.updateAt || previewPost.createAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <strong>ID:</strong> {previewPost.id} | <strong>Trạng thái:</strong> {previewPost.isPublished ? 'Đã xuất bản' : 'Bản nháp'} | <strong>Push:</strong> Sẵn sàng
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/news/${previewPost.id}`, '_blank')}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Mở trong tab mới
                  </Button>
                  <Button
                    onClick={() => setPreviewPost?.(null)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};