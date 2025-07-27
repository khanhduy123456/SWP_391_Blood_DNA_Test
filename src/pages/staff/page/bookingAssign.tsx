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
  Loader2,
  Dna,
  Heart,
  FileText,
  Package
} from 'lucide-react';
import { Checkbox } from '@/shared/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';

import type { ExRequest } from '../type/exRequestStaff';
import { getExRequestsByStaffId } from '../api/exRequestStaff.api';
import { getStaffIdByUserId } from '../api/staff.api';
import { getAllService } from '../api/service.api';
import toast, { Toaster } from 'react-hot-toast';
import { CreateKitDeliveryModal } from '../component/createKitDeliveryModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { updateExRequestStatus } from '../api/exRequestStaff.api';
import { getKitDeliveryByRequestId, type KitDelivery, acknowledgeKitDeliveryStatus } from '../api/delivery.api';

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

// Mapping cho status
const statusMapping: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
  '1': { name: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={16} /> },
  '2': { name: 'Đã chấp nhận', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  '3': { name: 'Đã lấy mẫu', color: 'bg-blue-100 text-blue-800', icon: <TestTube size={16} /> },
  '4': { name: 'Đang xử lý', color: 'bg-cyan-100 text-cyan-800', icon: <Loader2 size={16} /> },
  '5': { name: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-800', icon: <CheckCircle size={16} /> }
};

// Mapping trạng thái tiếp theo
const nextStatusMap: Record<string, { nextId: string; nextLabel: string } | undefined> = {
  '2': { nextId: '3', nextLabel: 'Xác nhận đã lấy mẫu' },
  '3': { nextId: '4', nextLabel: 'Bắt đầu xử lý' },
  '4': { nextId: '5', nextLabel: 'Hoàn thành' },
};

const BookingAssign: React.FC = () => {
  const [bookings, setBookings] = useState<(
    ExRequest & {
      serviceName?: string;
      servicePrice?: number;
      statusName?: string;
      userName?: string;
      staffName?: string;
      sampleMethodName?: string;
    }
  )[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDeliveryModalOpen, setIsCreateDeliveryModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [onlyToday, setOnlyToday] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; bookingId?: number; currentStatusId?: string }>(
    { open: false }
  );
  const [pendingStatus, setPendingStatus] = useState<{ nextId: string; nextLabel: string } | null>(null);
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; booking?: (typeof bookings)[0] }>(
    { open: false }
  );
  const [kitDeliveries, setKitDeliveries] = useState<Record<number, KitDelivery>>({});
  // Đặt sau khi bookings, statusFilter đã có giá trị
  // Lọc thêm theo ngày hôm nay nếu onlyToday bật
  const today = new Date();
  today.setHours(0,0,0,0);
  const filteredBookings = bookings
    .filter(b => statusFilter === 'all' ? true : b.statusId === statusFilter)
    .filter(b => {
      if (!onlyToday) return true;
      const appoint = new Date(b.appointmentTime);
      appoint.setHours(0,0,0,0);
      return appoint.getTime() === today.getTime();
    })
    .sort((a, b) => {
      if (a.statusId === '2' && b.statusId !== '2') return -1;
      if (a.statusId !== '2' && b.statusId === '2') return 1;
      return 0;
    });
  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginatedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

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

      // Lấy userId từ access token
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Không tìm thấy access token');
      }

      const payload = parseJwt(token);
      const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      if (!userId) {
        throw new Error('Không thể lấy userId từ token');
      }

      console.log('UserId từ token:', userId);

      // Lấy staffId từ userId
      const staffData = await getStaffIdByUserId(parseInt(userId));
      const staffId = staffData.staffId;
      
      console.log('StaffId:', staffId);

      // Lấy danh sách services
      const servicesData = await getAllService();

      // Lấy danh sách bookings theo staffId
      const bookingsData = await getExRequestsByStaffId(staffId);
      
      console.log('Số lượng bookings:', bookingsData.length);
      console.log('Bookings data:', bookingsData);

      // Kết hợp thông tin với dữ liệu thực tế
      const extendedBookings = bookingsData.map(booking => {
        const service = servicesData.find(s => s.id === booking.serviceId);
        const status = statusMapping[booking.statusId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle size={16} /> };
        return {
          ...booking,
          serviceName: service?.name || booking.serviceName || 'Không xác định',
          servicePrice: service?.price || 0,
          statusName: booking.statusName || status.name,
          userName: booking.userName,
          staffName: booking.staffName,
          sampleMethodName: booking.sampleMethodName,
        };
      });
      setBookings(extendedBookings);
      
      // Lấy thông tin kit delivery cho các request có methodId = 2
      // Chỉ gọi API khi thực sự cần thiết (khi booking đã được chấp nhận)
      const deliveryRequests = extendedBookings.filter(booking => 
        booking.sampleMethodId === 2 && 
        (booking.statusId === '2' || booking.statusId === '3' || booking.statusId === '4' || booking.statusId === '5')
      );
      
      if (deliveryRequests.length > 0) {
        const deliveryPromises = deliveryRequests.map(async (booking) => {
          try {
            const delivery = await getKitDeliveryByRequestId(booking.id);
            return { requestId: booking.id, delivery };
          } catch (error: unknown) {
            // Chỉ log khi không phải lỗi 404 (Not Found)
            if (error && typeof error === 'object' && 'response' in error) {
              const axiosError = error as { response?: { status?: number } };
              if (axiosError.response?.status !== 404) {
                console.log(`Lỗi khi lấy kit delivery cho request ${booking.id}:`, error);
              }
            }
            return { requestId: booking.id, delivery: null };
          }
        });
        
        const deliveryResults = await Promise.all(deliveryPromises);
        const deliveryMap: Record<number, KitDelivery> = {};
        deliveryResults.forEach(result => {
          if (result.delivery) {
            deliveryMap[result.requestId] = result.delivery;
          }
        });
        setKitDeliveries(deliveryMap);
      } else {
        setKitDeliveries({});
      }
      
      // Hiển thị thông báo phù hợp
      if (bookingsData.length === 0) {
        toast.success('Tải dữ liệu thành công! Hiện tại bạn chưa được phân công booking nào.');
      } else {
        const deliveryRequests = extendedBookings.filter(booking => 
          booking.sampleMethodId === 2 && 
          (booking.statusId === '2' || booking.statusId === '3' || booking.statusId === '4' || booking.statusId === '5')
        );
        toast.success(`Tải dữ liệu thành công! Có ${bookingsData.length} booking được phân công.${deliveryRequests.length > 0 ? ` Kiểm tra ${deliveryRequests.length} Kit Delivery.` : ''}`);
      }
      
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm handleUpdateStatus
  const handleUpdateStatus = async (requestId: number, currentStatusId: string) => {
    const next = nextStatusMap[currentStatusId];
    if (!next) return;
    setConfirmDialog({ open: true, bookingId: requestId, currentStatusId });
    setPendingStatus(next);
  };
  const handleConfirmUpdate = async () => {
    if (!confirmDialog.bookingId || !confirmDialog.currentStatusId || !pendingStatus) return;
    try {
      const res = await updateExRequestStatus(confirmDialog.bookingId, pendingStatus.nextId);
      toast.success('Cập nhật trạng thái thành công!');
      setConfirmDialog({ open: false });
      setPendingStatus(null);
      // Cập nhật booking trong state, không fetch lại toàn bộ
      setBookings(prev => prev.map(b =>
        b.id === confirmDialog.bookingId
          ? { ...b, statusId: pendingStatus.nextId, statusName: pendingStatus.nextLabel, updateAt: res.updatedAt }
          : b
      ));
    } catch {
      toast.error('Cập nhật trạng thái thất bại!');
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

  const statsSource = onlyToday ? filteredBookings : bookings;

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang chờ xử lý</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {statsSource.filter(b => b.statusId === '1').length}
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
                  <p className="text-sm font-medium text-gray-600">Đã chấp nhận</p>
                  <p className="text-2xl font-bold text-green-600">
                    {statsSource.filter(b => b.statusId === '2').length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã lấy mẫu</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {statsSource.filter(b => b.statusId === '3').length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TestTube className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang xử lý</p>
                  <p className="text-2xl font-bold text-cyan-600">
                    {statsSource.filter(b => b.statusId === '4').length}
                  </p>
                </div>
                <div className="p-3 bg-cyan-100 rounded-full">
                  <Loader2 className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {statsSource.filter(b => b.statusId === '5').length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thêm UI checkbox lọc hôm nay phía trên danh sách */}
        <div className="flex justify-between mb-4">
          <div></div>
          {/* Thay đổi UI cho checkbox lọc hôm nay */}
          <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm border border-blue-100">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-blue-500 mr-2" />
              <Checkbox id="onlyToday" checked={onlyToday} onCheckedChange={checked => setOnlyToday(checked === true)} />
            </div>
            <label htmlFor="onlyToday" className="text-sm font-medium text-blue-700 select-none cursor-pointer">Chỉ hiển thị phân công hôm nay</label>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="2">Đã chấp nhận (Accepted)</SelectItem>
              <SelectItem value="3">Đã lấy mẫu (SampleCollected)</SelectItem>
              <SelectItem value="4">Đang xử lý (Processing)</SelectItem>
              <SelectItem value="5">Hoàn thành (Completed)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Booking List */}
        <div className="space-y-6">
          {paginatedBookings.length === 0 ? (
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
            paginatedBookings.map((booking) => {
              const status = statusMapping[booking.statusId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: <AlertCircle size={16} /> };

              return (
                <Card key={booking.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Left side - Booking info */}
                      <div className="flex-1 space-y-4">
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
                            <User className="w-4 h-4" />
                            <span>Khách hàng: {booking.userName} (ID: {booking.userId})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Nhân viên: {booking.staffName} (ID: {booking.staffId})</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">Giá: {booking.servicePrice?.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Phương pháp lấy mẫu: {booking.sampleMethodName}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Trạng thái: {booking.statusName || status.name}</span>
                          </div>
                          {booking.sampleMethodId === 2 && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>Trạng thái vận chuyển: </span>
                              {kitDeliveries[booking.id] ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  kitDeliveries[booking.id].statusId === 'Pending' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : kitDeliveries[booking.id].statusId === 'Sent' 
                                    ? 'bg-orange-100 text-orange-800'
                                    : kitDeliveries[booking.id].statusId === 'Received' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {kitDeliveries[booking.id].statusId === 'Pending' ? 'Chờ xử lý' :
                                   kitDeliveries[booking.id].statusId === 'Sent' ? 'Đã gửi' :
                                   kitDeliveries[booking.id].statusId === 'Received' ? 'Đã nhận' : 'Đã trả'}
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Chưa tạo Kit Delivery
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Ngày hẹn: {formatDate(booking.appointmentTime)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Giờ hẹn: {new Date(booking.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
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
                            onClick={() => setDetailDialog({ open: true, booking })}
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
                          {booking.sampleMethodId === 2 && 
                           (booking.statusId === '2' || booking.statusId === '3' || booking.statusId === '4' || booking.statusId === '5') &&
                           !kitDeliveries[booking.id] && (
                            <Button 
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                setSelectedRequestId(booking.id);
                                setIsCreateDeliveryModalOpen(true);
                              }}
                            >
                              <Package className="w-4 h-4 mr-1" />
                              Tạo Kit Delivery
                            </Button>
                          )}
                        </div>
                        {/* Nút xác nhận trạng thái Kit Delivery */}
                        {booking.sampleMethodId === 2 && kitDeliveries[booking.id] && (
                          <div className="flex flex-col gap-2 mt-2">
                            {kitDeliveries[booking.id].statusId === 'Sent' && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={async () => {
                                  try {
                                    await acknowledgeKitDeliveryStatus(kitDeliveries[booking.id].id, 'Received');
                                    toast.success('Đã xác nhận người dùng ĐÃ NHẬN Kit!');
                                    fetchData();
                                  } catch {
                                    toast.error('Xác nhận người dùng ĐÃ NHẬN Kit thất bại!');
                                  }
                                }}
                              >
                                Xác nhận người dùng ĐÃ NHẬN kit
                              </Button>
                            )}
                            {kitDeliveries[booking.id].statusId === 'Received' && (
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={async () => {
                                  try {
                                    await acknowledgeKitDeliveryStatus(kitDeliveries[booking.id].id, 'Returned');
                                    toast.success('Đã xác nhận ĐÃ TRẢ kit delivery!');
                                    fetchData();
                                  } catch {
                                    toast.error('Xác nhận ĐÃ TRẢ kit delivery thất bại!');
                                  }
                                }}
                              >
                                Xác nhận ĐÃ TRẢ kit
                              </Button>
                            )}
                          </div>
                        )}
                        {/* Nút cập nhật trạng thái request chỉ enable khi kit delivery đã Returned */}
                        {(!booking.sampleMethodId || booking.sampleMethodId !== 2 || (kitDeliveries[booking.id] && kitDeliveries[booking.id].statusId === 'Returned')) && nextStatusMap[booking.statusId] && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleUpdateStatus(booking.id, booking.statusId)}
                          >
                            {nextStatusMap[booking.statusId]?.nextLabel}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

        {/* Create Kit Delivery Modal */}
        {selectedRequestId && (
          <CreateKitDeliveryModal
            isOpen={isCreateDeliveryModalOpen}
            onClose={() => {
              setIsCreateDeliveryModalOpen(false);
              setSelectedRequestId(null);
            }}
            onSuccess={() => {
              // Có thể refresh data hoặc thêm logic khác nếu cần
              toast.success('Kit delivery đã được tạo thành công!');
              fetchData(); // Refresh data sau khi tạo thành công
            }}
            requestId={selectedRequestId}
          />
        )}

        {/* Dialog xác nhận cập nhật trạng thái */}
        <Dialog open={confirmDialog.open} onOpenChange={open => setConfirmDialog(v => ({ ...v, open }))}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận cập nhật trạng thái</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-gray-700">
              Bạn có chắc muốn chuyển trạng thái sang <span className="font-semibold text-blue-600">{pendingStatus?.nextLabel}</span> cho yêu cầu này không?
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialog({ open: false })}>Hủy</Button>
              <Button className="bg-blue-600 text-white" onClick={handleConfirmUpdate}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog chi tiết booking */}
        <Dialog open={detailDialog.open} onOpenChange={open => setDetailDialog(v => ({ ...v, open }))}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Chi tiết phân công</DialogTitle>
            </DialogHeader>
            {detailDialog.booking && (
              <div className="space-y-2 text-gray-700 text-sm">
                <div><span className="font-semibold">Mã yêu cầu:</span> #{detailDialog.booking.id}</div>
                <div><span className="font-semibold">Tên dịch vụ:</span> {detailDialog.booking.serviceName}</div>
                <div><span className="font-semibold">Khách hàng:</span> {detailDialog.booking.userName} (ID: {detailDialog.booking.userId})</div>
                <div><span className="font-semibold">Nhân viên phụ trách:</span> {detailDialog.booking.staffName} (ID: {detailDialog.booking.staffId})</div>
                <div><span className="font-semibold">Phương pháp lấy mẫu:</span> {detailDialog.booking.sampleMethodName}</div>
                <div><span className="font-semibold">Trạng thái:</span> {detailDialog.booking.statusName}</div>
                <div><span className="font-semibold">Ngày hẹn:</span> {formatDate(detailDialog.booking.appointmentTime)} {new Date(detailDialog.booking.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                <div><span className="font-semibold">Ngày tạo:</span> {formatDateTime(detailDialog.booking.createAt)}</div>
                <div><span className="font-semibold">Cập nhật lần cuối:</span> {formatDateTime(detailDialog.booking.updateAt)}</div>
                <div><span className="font-semibold">Giá dịch vụ:</span> {detailDialog.booking.servicePrice?.toLocaleString('vi-VN')} VNĐ</div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailDialog({ open: false })}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BookingAssign;
