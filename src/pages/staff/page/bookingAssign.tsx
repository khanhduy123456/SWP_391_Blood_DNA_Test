import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { 
  Calendar, 
  Clock, 
  User, 
  TestTube, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Dna,
  Heart,
  FileText
} from 'lucide-react';

import type { ExRequest } from '../type/exRequestStaff';
import type { Service } from '../type/service';
import toast, { Toaster } from 'react-hot-toast';

// Interface mở rộng cho ExRequest với thông tin bổ sung
interface ExtendedExRequest extends ExRequest {
  serviceName?: string;
  servicePrice?: number;
  statusName?: string;
  priorityName?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}

// Mapping cho status
const statusMapping: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
  '1': { name: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} /> },
  '2': { name: 'Đã chấp nhận', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  '3': { name: 'Đã từ chối', color: 'bg-red-100 text-red-800', icon: <XCircle size={16} /> },
  '4': { name: 'Đang xử lý', color: 'bg-blue-100 text-blue-800', icon: <Loader2 size={16} /> },
  '5': { name: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800', icon: <CheckCircle size={16} /> }
};

// Mapping cho priority
const priorityMapping: Record<number, { name: string; color: string }> = {
  1: { name: 'Thấp', color: 'bg-gray-100 text-gray-800' },
  2: { name: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' },
  3: { name: 'Cao', color: 'bg-orange-100 text-orange-800' },
  4: { name: 'Khẩn cấp', color: 'bg-red-100 text-red-800' }
};

// Fake data cho testing
const fakeServices: Service[] = [
  {
    id: 1,
    name: 'Xét nghiệm ADN Cha - Con',
    description: 'Xác định mối quan hệ huyết thống cha con',
    requirements: 'Mẫu máu hoặc niêm mạc miệng',
    type: 'ADN Huyết thống',
    price: 2500000,
    createAt: '2024-01-01T00:00:00Z',
    updateAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Xét nghiệm ADN Mẹ - Con',
    description: 'Xác định mối quan hệ huyết thống mẹ con',
    requirements: 'Mẫu máu hoặc niêm mạc miệng',
    type: 'ADN Huyết thống',
    price: 2500000,
    createAt: '2024-01-01T00:00:00Z',
    updateAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Xét nghiệm ADN Anh Em',
    description: 'Xác định mối quan hệ anh em ruột',
    requirements: 'Mẫu máu hoặc niêm mạc miệng',
    type: 'ADN Huyết thống',
    price: 3000000,
    createAt: '2024-01-01T00:00:00Z',
    updateAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Xét nghiệm ADN Ông Bà - Cháu',
    description: 'Xác định mối quan hệ ông bà với cháu',
    requirements: 'Mẫu máu hoặc niêm mạc miệng',
    type: 'ADN Huyết thống',
    price: 3500000,
    createAt: '2024-01-01T00:00:00Z',
    updateAt: '2024-01-01T00:00:00Z'
  }
];

const fakeBookings: ExRequest[] = [
  {
    id: 1001,
    userId: 101,
    serviceId: 1,
    priorityId: 3,
    sampleMethodId: 1,
    statusId: '1',
    appointmentTime: '2024-12-25T09:00:00.000Z',
    createAt: '2024-12-20T10:30:00.000Z',
    updateAt: '2024-12-20T10:30:00.000Z',
    staffId: 1
  },
  {
    id: 1002,
    userId: 102,
    serviceId: 2,
    priorityId: 4,
    sampleMethodId: 2,
    statusId: '4',
    appointmentTime: '2024-12-26T14:00:00.000Z',
    createAt: '2024-12-19T15:45:00.000Z',
    updateAt: '2024-12-21T08:20:00.000Z',
    staffId: 1
  },
  {
    id: 1003,
    userId: 103,
    serviceId: 3,
    priorityId: 2,
    sampleMethodId: 1,
    statusId: '5',
    appointmentTime: '2024-12-24T11:30:00.000Z',
    createAt: '2024-12-18T09:15:00.000Z',
    updateAt: '2024-12-23T16:30:00.000Z',
    staffId: 1
  },
  {
    id: 1004,
    userId: 104,
    serviceId: 4,
    priorityId: 1,
    sampleMethodId: 2,
    statusId: '2',
    appointmentTime: '2024-12-27T16:00:00.000Z',
    createAt: '2024-12-21T13:20:00.000Z',
    updateAt: '2024-12-22T10:45:00.000Z',
    staffId: 1
  },
  {
    id: 1005,
    userId: 105,
    serviceId: 1,
    priorityId: 3,
    sampleMethodId: 1,
    statusId: '3',
    appointmentTime: '2024-12-28T10:00:00.000Z',
    createAt: '2024-12-22T11:30:00.000Z',
    updateAt: '2024-12-22T14:15:00.000Z',
    staffId: 1
  }
];

const BookingAssign: React.FC = () => {
  const [bookings, setBookings] = useState<ExtendedExRequest[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);




  // Format datetime
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };



  // Fetch dữ liệu
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Sử dụng fake data để test UI
      
      // Kết hợp thông tin với fake data
      const extendedBookings: ExtendedExRequest[] = fakeBookings.map(booking => {
        const service = fakeServices.find(s => s.id === booking.serviceId);
        const status = statusMapping[booking.statusId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle size={16} /> };
        const priority = priorityMapping[booking.priorityId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800' };

        return {
          ...booking,
          serviceName: service?.name || 'Không xác định',
          servicePrice: service?.price || 0,
          statusName: status.name,
          priorityName: priority.name,
        };
      });

      setBookings(extendedBookings);
      
      // Thông báo đang sử dụng fake data
      toast('Đang sử dụng dữ liệu mẫu để demo UI', {
        duration: 3000,
        icon: '🧪',
      });
      
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            <p className="text-lg font-semibold text-gray-700">Đang tải danh sách phân công...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchData} className="bg-green-600 hover:bg-green-700">
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <Dna className="w-8 h-8 text-green-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Danh Sách Phân Công Xét Nghiệm
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quản lý các yêu cầu xét nghiệm ADN huyết thống được phân công cho bạn
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng số phân công</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bookings.filter(b => b.statusId === '1').length}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter(b => b.statusId === '4').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Loader2 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter(b => b.statusId === '5').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking List */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Chưa có phân công nào
                    </h3>
                    <p className="text-gray-600">
                      Hiện tại bạn chưa được phân công xử lý yêu cầu xét nghiệm nào.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => {
              const status = statusMapping[booking.statusId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle size={16} /> };
              const priority = priorityMapping[booking.priorityId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800' };

              return (
                <Card key={booking.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left side - Booking info */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <TestTube className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {booking.serviceName}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Mã yêu cầu: #{booking.id}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Ngày hẹn: {formatDate(booking.appointmentTime)}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Giờ hẹn: {new Date(booking.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <User className="w-4 h-4" />
                                <span>Khách hàng ID: {booking.userId}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <span className="font-medium">Giá: {booking.servicePrice?.toLocaleString('vi-VN')} VNĐ</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Status and actions */}
                      <div className="flex flex-col items-end space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${status.color} flex items-center space-x-1`}>
                            {status.icon}
                            <span>{status.name}</span>
                          </Badge>
                          <Badge className={`${priority.color}`}>
                            {priority.name}
                          </Badge>
                        </div>

                        <div className="text-xs text-gray-500 text-right">
                          <p>Tạo lúc: {formatDateTime(booking.createAt)}</p>
                          {booking.updateAt !== booking.createAt && (
                            <p>Cập nhật: {formatDateTime(booking.updateAt)}</p>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-50"
                          >
                            Xem chi tiết
                          </Button>
                          {booking.statusId === '1' && (
                            <Button 
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Bắt đầu xử lý
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingAssign;
