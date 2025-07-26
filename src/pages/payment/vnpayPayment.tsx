import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { createPayment } from './api/payment.api';
import { getAllService } from '@/pages/staff/api/service.api';
import type { Service } from '@/pages/staff/type/service';
import { getExRequestsByAccountId } from '@/pages/customer/api/exRequest.api';
import type { ExRequestResponse } from '@/pages/customer/types/exRequestPaged';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText, 
  Package, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronLeft
} from 'lucide-react';

// Sử dụng interface từ booking-list.tsx
type RequestItem = ExRequestResponse;

const VNPayPayment: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Lấy userId từ localStorage hoặc từ token
  const getUserId = () => {
    // Thử lấy từ localStorage trước
    const userIdFromStorage = localStorage.getItem('userId');
    if (userIdFromStorage) {
      return Number(userIdFromStorage);
    }
    
    // Nếu không có, thử parse từ token
    const token = localStorage.getItem('accessToken');
    if (token) {
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
        const payload = JSON.parse(jsonPayload);
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        return Number(userId);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
    
    return 0;
  };

  const userId = getUserId();

  // Hàm lấy request cụ thể hoặc tất cả request có status = 2
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy danh sách services trước
      const serviceList = await getAllService();
      setServices(serviceList);
      
      // Kiểm tra xem có requestId cụ thể không
      const specificRequestId = searchParams.get('requestId');
      
      if (specificRequestId) {
        // Nếu có requestId cụ thể, chỉ lấy request đó
        const response = await getExRequestsByAccountId(userId, 1, 100);
        const data = response.items || [];
        const specificRequest = data.find((item: RequestItem) => 
          item.id === Number(specificRequestId) && item.statusId === "2"
        );
        
        if (specificRequest) {
          console.log('Found specific request:', specificRequest);
          setRequests([specificRequest]);
        } else {
          console.log('Specific request not found or not accepted');
          setError('Không tìm thấy yêu cầu thanh toán hoặc yêu cầu chưa được chấp nhận.');
          setRequests([]);
        }
      } else {
        // Nếu không có requestId, lấy tất cả request có status = "2"
        const response = await getExRequestsByAccountId(userId, 1, 100);
        const data = response.items || [];
        
        console.log('API Response:', response);
        console.log('Total items:', data.length);
        
        const acceptedRequests = data.filter((item: RequestItem) => item.statusId === "2");
        console.log('Accepted requests:', acceptedRequests.length);
        
        setRequests(acceptedRequests);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách request:', error);
      setError('Không thể lấy danh sách request.');
    } finally {
      setLoading(false);
    }
  }, [userId, searchParams]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Helper function để lấy thông tin service
  const getService = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  // Hàm handlePayment với thông tin đầy đủ
  const handlePayment = async (request: RequestItem) => {
    setLoading(true);
    setError(null);
    try {
      const service = getService(request.serviceId);
      console.log('Service found:', service);
      
      // Tạo thông tin thanh toán từ request
      const paymentData = {
        userId: request.userId,
        requestId: request.id,
        amount: service?.price || 0, // Sử dụng giá từ service
        orderInfo: `Thanh toán ${service?.name || 'dịch vụ xét nghiệm'} - Đơn hàng #${request.id}`,
      };
      
      console.log('Payment data:', paymentData);
      
      const res = await createPayment(paymentData);
      console.log('Payment response:', res);
      
      const paymentUrl = res.paymentUrl;
      console.log('Payment URL:', paymentUrl);
      
      if (paymentUrl) {
        console.log('Redirecting to:', paymentUrl);
        setError(null);
        window.location.href = paymentUrl;
      } else {
        console.log('No payment URL received');
        setError('Không nhận được link thanh toán từ hệ thống.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán:', error);
      setError('Có lỗi khi tạo thanh toán.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  THANH TOÁN VNPAY
                </h1>
                <p className="text-gray-600 text-sm">Hoàn tất thanh toán để tiếp tục quá trình xét nghiệm ADN</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/customer/booking-list')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
                <p className="text-blue-600 font-medium text-lg">Đang tải thông tin thanh toán...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="shadow-sm border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {requests.length === 0 && !loading && (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <CheckCircle className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">Không có yêu cầu nào cần thanh toán</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Tất cả các đơn hàng đã chấp nhận của bạn đã được thanh toán thành công hoặc chưa được chấp nhận.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment List */}
        {requests.length > 0 && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Danh sách thanh toán ({requests.length})
              </h2>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-4 w-4 mr-1" />
                Đã chấp nhận
              </Badge>
            </div>

            <div className="grid gap-6">
              {requests.map((req) => {
                const service = getService(req.serviceId);
                return (
                  <Card key={req.id} className="shadow-sm hover:shadow-md transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                            <Package className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {service?.name || `Dịch vụ #${req.serviceId}`}
                              </h3>
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                Đơn hàng #{req.id}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(req.appointmentTime).toLocaleDateString("vi-VN")}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(req.appointmentTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Tổng tiền</p>
                            <p className="text-2xl font-bold text-green-600">
                              {service?.price ? service.price.toLocaleString() + "₫" : "Chưa xác định"}
                            </p>
                          </div>
                          <Button
                            size="lg"
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8"
                            onClick={() => handlePayment(req)}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Thanh toán ngay
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Mô tả dịch vụ</p>
                              <p className="text-sm text-gray-600">{service?.description || "Dịch vụ xét nghiệm ADN chuyên nghiệp"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Chi tiết giá</p>
                              <p className="text-sm text-gray-600">
                                {service?.price ? `${service.price.toLocaleString()}₫` : "Chưa cập nhật"} - Thanh toán qua VNPay
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Ngày tạo đơn</p>
                              <p className="text-sm text-gray-600">{new Date(req.createAt).toLocaleString("vi-VN")}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="font-medium text-gray-900">Trạng thái</p>
                              <p className="text-sm text-gray-600">Đã được chấp nhận - Sẵn sàng thanh toán</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VNPayPayment; 