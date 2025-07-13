'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Edit3, Save, X, Shield, Dna, Heart } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import toast from 'react-hot-toast';
import { getUserById, updateUserProfile, type UpdateUserProfilePayload } from '../api/profile.api';
import type { UserAccount } from '../types/userAccount';

// Hàm parseJwt để lấy userId từ accessToken
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<UpdateUserProfilePayload>({
    name: '',
    phone: '',
    address: '',
  });
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Lấy userId từ access token
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = parseJwt(token);
      const userIdFromToken = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      if (userIdFromToken) {
        setUserId(Number(userIdFromToken));
      }
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
      setFormData({
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      });
    } catch {
      toast.error('Không thể tải thông tin profile!', {
        duration: 3000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateUserProfilePayload, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        duration: 3000,
        position: 'bottom-right',
      });
      return;
    }

    if (!userId) {
      toast.error('Không tìm thấy thông tin người dùng!', {
        duration: 3000,
        position: 'bottom-right',
      });
      return;
    }

    try {
      setSaving(true);
      await updateUserProfile(userId, formData);
      
      // Cập nhật lại thông tin user
      const updatedUser = await getUserById(userId);
      setUser(updatedUser);
      
      setEditing(false);
      toast.success('Cập nhật thông tin thành công!', {
        duration: 3000,
        position: 'bottom-right',
      });
    } catch {
      toast.error('Cập nhật thông tin thất bại!', {
        duration: 3000,
        position: 'bottom-right',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        address: user.address,
      });
    }
    setEditing(false);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Vui lòng đăng nhập</h3>
          <p className="text-gray-600">Bạn cần đăng nhập để xem thông tin profile</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy thông tin</h3>
          <p className="text-gray-600">Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full mb-4">
            <Dna className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hồ sơ cá nhân</h1>
          <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-green-100 flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-200" />
                <span className="text-sm font-medium">Khách hàng VIP</span>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Thông tin cá nhân
                  </h3>
                  {!editing && (
                    <Button
                      onClick={() => setEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2 border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    {editing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Nhập họ và tên"
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-800">{user.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      Số điện thoại
                    </label>
                    {editing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Nhập số điện thoại"
                        className="w-full"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-800">{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      Địa chỉ
                    </label>
                    {editing ? (
                      <Textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Nhập địa chỉ"
                        className="w-full"
                        rows={3}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-lg border">
                        <span className="text-gray-800">{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {editing && (
                  <div className="flex space-x-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      <span>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Hủy</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin bổ sung
                </h3>

                {/* Account Status */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Trạng thái tài khoản</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Hoạt động
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại tài khoản:</span>
                      <span className="font-medium text-gray-800">Khách hàng</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngày tham gia:</span>
                      <span className="font-medium text-gray-800">
                        {new Date().toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lần xét nghiệm:</span>
                      <span className="font-medium text-gray-800">0</span>
                    </div>
                  </div>
                </div>

                {/* DNA Test Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-center mb-4">
                    <Dna className="h-5 w-5 mr-2 text-blue-600" />
                    <h4 className="font-semibold text-gray-800">Xét nghiệm ADN</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng số xét nghiệm:</span>
                      <span className="font-medium text-gray-800">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Xét nghiệm gần nhất:</span>
                      <span className="font-medium text-gray-800">Chưa có</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        Chưa có dữ liệu
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                  <h4 className="font-semibold text-gray-800 mb-4">Thao tác nhanh</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Đặt lịch xét nghiệm
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Xem lịch sử xét nghiệm
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Thông tin gia đình
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 Trung tâm Xét nghiệm ADN Huyết thống. Bảo mật thông tin của bạn là ưu tiên hàng đầu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
