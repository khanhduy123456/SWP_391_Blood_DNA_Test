import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Search, Calendar, User, Eye, ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { getPublishedBlogPosts, type BlogPost } from '@/features/admin/api/blog.api';

const NewsList: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Generate unique component ID
  const componentId = `news-list-${Date.now()}`;

  const categories = [
    "Tất cả",
    "Xét nghiệm ADN",
    "Hướng dẫn", 
    "Tin tức y tế",
    "Nghiên cứu khoa học",
    "Tư vấn",
    "Khác"
  ];

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, selectedCategory]);

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true);
      const posts = await getPublishedBlogPosts();
      setBlogPosts(posts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = blogPosts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "Tất cả") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải tin tức...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft size={20} className="mr-2" />
              Về trang chủ
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Tin Tức & Kiến Thức</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về xét nghiệm ADN, hướng dẫn và kiến thức y khoa
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-200 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map((category, index) => (
                  <option key={`option-${category}-${index}`} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center md:justify-end">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredPosts.length} bài viết
              </Badge>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-blue-600" />
              Bài viết nổi bật
            </h2>
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {filteredPosts[0].category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-4 text-white">
                    {filteredPosts[0].title}
                  </CardTitle>
                  <p className="text-blue-100 mb-6 line-clamp-3">
                    {filteredPosts[0].summary}
                  </p>
                  <div className="flex items-center gap-4 text-blue-100 text-sm mb-6">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{filteredPosts[0].author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(filteredPosts[0].createAt)}</span>
                    </div>
                    {filteredPosts[0].viewCount && (
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{filteredPosts[0].viewCount} lượt xem</span>
                      </div>
                    )}
                  </div>
                  <Link to={`/news/${filteredPosts[0].id}`}>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">
                      Đọc chi tiết
                    </Button>
                  </Link>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">🧬</div>
                    <p className="text-blue-100 text-lg">Xét nghiệm ADN</p>
                    <p className="text-blue-200">Chính xác - An toàn - Bảo mật</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post, index) => (
            <Card key={`${componentId}-news-${post.id}-${index}`} className="hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock size={14} />
                    <span>{formatDate(post.createAt)}</span>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.summary}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <Link to={`/news/${post.id}`}>
                    <Button variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                      Đọc thêm
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <Card className="text-center py-16">
            <div className="text-gray-500">
              <Search size={64} className="mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Không tìm thấy bài viết nào</h3>
              <p className="text-gray-400 mb-6">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </Card>
        )}

        {/* Newsletter Signup */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Đăng ký nhận tin tức mới nhất
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Nhận thông báo về những bài viết mới nhất về xét nghiệm ADN và kiến thức y khoa
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Nhập email của bạn"
                className="flex-1 border-gray-200 focus:border-blue-500"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Đăng ký
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsList; 