import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { 
  Users, 
  FileText, 
  Plus, 
  Clock,
  Settings,
  BarChart3,
  Activity
} from 'lucide-react';
import { getAllUsers } from '../api/user.api';
import { getAllBlogPosts } from '../api/blog.api';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  totalUsers: number;
  totalBlogs: number;
  activeUsers: number;
  inactiveUsers: number;
  publishedBlogs: number;
  draftBlogs: number;
  usersByRole: {
    Admin: number;
    Staff: number;
    Manager: number;
    Customer: number;
  };
}

interface RecentActivity {
  id: number;
  type: 'user' | 'blog';
  title: string;
  description: string;
  date: string;
  status: string;
}

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBlogs: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    usersByRole: {
      Admin: 0,
      Staff: 0,
      Manager: 0,
      Customer: 0,
    },
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch all data in parallel
      const [users, blogs] = await Promise.all([
        getAllUsers(),
        getAllBlogPosts(),
      ]);

      // Process user statistics
      const activeUsers = users.filter(user => user.status).length;
      const inactiveUsers = users.filter(user => !user.status).length;
      
      const usersByRole = {
        Admin: users.filter(user => user.role === 'System Admin').length,
        Staff: users.filter(user => user.role === 'Staff').length,
        Manager: users.filter(user => user.role === 'Unknown').length, // Manager role
        Customer: users.filter(user => user.role === 'User').length,
      };

      // Process blog statistics
      const publishedBlogs = blogs.filter(blog => blog.isPublished).length;
      const draftBlogs = blogs.filter(blog => !blog.isPublished).length;

      setStats({
        totalUsers: users.length,
        totalBlogs: blogs.length,
        activeUsers,
        inactiveUsers,
        publishedBlogs,
        draftBlogs,
        usersByRole,
      });

      // Generate recent activities
      const activities: RecentActivity[] = [
        // Recent users
        ...users.slice(0, 3).map(user => ({
          id: user.userId,
          type: 'user' as const,
          title: user.email.split('@')[0],
          description: `Người dùng mới - ${user.role}`,
          date: new Date().toLocaleDateString('vi-VN'),
          status: user.status ? 'Hoạt động' : 'Đã khóa',
        })),
        // Recent blogs
        ...blogs.slice(0, 2).map(blog => ({
          id: blog.id,
          type: 'blog' as const,
          title: blog.title,
          description: `Bài viết ${blog.isPublished ? 'đã xuất bản' : 'bản nháp'}`,
          date: new Date(blog.createAt).toLocaleDateString('vi-VN'),
          status: blog.isPublished ? 'Đã xuất bản' : 'Bản nháp',
        })),
      ];

      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users size={16} className="text-blue-600" />;
      case 'blog':
        return <FileText size={16} className="text-green-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hoạt động':
      case 'Đã xuất bản':
        return 'bg-green-100 text-green-700';
      case 'Đã khóa':
      case 'Bản nháp':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống xét nghiệm ADN</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-blue-100">
                {stats.activeUsers} hoạt động, {stats.inactiveUsers} đã khóa
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bài viết</CardTitle>
              <FileText className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBlogs}</div>
              <p className="text-xs text-green-100">
                {stats.publishedBlogs} đã xuất bản, {stats.draftBlogs} bản nháp
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng quan</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers + stats.totalBlogs}</div>
              <p className="text-xs text-orange-100">
                Tổng số mục quản lý
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Distribution Chart */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Phân bố người dùng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Admin</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {stats.usersByRole.Admin}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Staff</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {stats.usersByRole.Staff}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Manager</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {stats.usersByRole.Manager}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Customer</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {stats.usersByRole.Customer}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-600" />
                Thao tác nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate('/admin/users')}
                  className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quản lý người dùng
                </Button>
                <Button 
                  onClick={() => navigate('/admin/blogs')}
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quản lý bài viết
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400">{activity.date}</span>
                        <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;