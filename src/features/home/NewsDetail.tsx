import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { ArrowLeft, Calendar, User, Eye, Share2, BookOpen, Tag, Clock, TrendingUp } from 'lucide-react';
import { getBlogPostById, getPublishedBlogPosts, type BlogPost } from '@/features/admin/api/blog.api';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlogPost();
      fetchRelatedPosts();
    }
  }, [id]);

  const fetchBlogPost = async () => {
    try {
      setIsLoading(true);
      if (id) {
        const post = await getBlogPostById(parseInt(id));
        setBlogPost(post);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const posts = await getPublishedBlogPosts();
      // Filter out current post and get 3 related posts
      const filtered = posts
        .filter(post => post.id !== parseInt(id || '0'))
        .slice(0, 3);
      setRelatedPosts(filtered);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost?.title,
        text: blogPost?.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link bài viết!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-16">
            <div className="text-gray-500">
              <BookOpen size={64} className="mx-auto mb-6 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">Không tìm thấy bài viết</h3>
              <p className="text-gray-400 mb-6">
                Bài viết này có thể đã bị xóa hoặc không tồn tại
              </p>
              <Button
                onClick={() => navigate('/news')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <ArrowLeft size={16} className="mr-2" />
                Về trang tin tức
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white shadow-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/news')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft size={20} className="mr-2" />
              Về trang tin tức
            </Button>
          </div>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {blogPost.category}
              </Badge>
              <div className="flex items-center gap-4 text-blue-100 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{formatDate(blogPost.createAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{blogPost.author}</span>
                </div>
                {blogPost.viewCount && (
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{blogPost.viewCount} lượt xem</span>
                  </div>
                )}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {blogPost.title}
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              {blogPost.summary}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                {/* Article Meta */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Đăng ngày {formatDate(blogPost.createAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>Tác giả: {blogPost.author}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sharePost}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Share2 size={16} className="mr-2" />
                    Chia sẻ
                  </Button>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {blogPost.content}
                  </div>
                </div>

                {/* Article Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-500" />
                      <span className="text-gray-600">Danh mục:</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {blogPost.category}
                      </Badge>
                    </div>
                    <div className="text-gray-500 text-sm">
                      Cập nhật lần cuối: {formatDate(blogPost.updateAt || blogPost.createAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <TrendingUp size={24} className="text-blue-600" />
                  Bài viết liên quan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((post, index) => (
                    <Card key={`related-${post.id}-${index}`} className="hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200 group">
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
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <User size={20} />
                  Tác giả
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                    {blogPost.author.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{blogPost.author}</h3>
                  <p className="text-gray-600 text-sm">
                    Chuyên gia xét nghiệm ADN
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen size={20} />
                  Liên kết nhanh
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/dich-vu-xet-nghiem-adn-huyet-thong-cha-con">
                    <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50">
                      Xét nghiệm ADN Cha-Con
                    </Button>
                  </Link>
                  <Link to="/dich-vu-xet-nghiem-adn-lam-giay-khai-sinh-cho-con">
                    <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50">
                      Xét nghiệm ADN Khai sinh
                    </Button>
                  </Link>
                  <Link to="/news">
                    <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50">
                      Tất cả tin tức
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                  <BookOpen size={20} />
                  Tư vấn miễn phí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-gray-700 mb-4">
                    Cần tư vấn về xét nghiệm ADN?
                  </p>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    Liên hệ ngay
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail; 