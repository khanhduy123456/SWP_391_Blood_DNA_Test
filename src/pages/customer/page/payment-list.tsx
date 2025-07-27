import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPaymentsByUserId } from "../api/payment.api";
import type { PaymentResponse, PagedPaymentResponse } from "../api/payment.api";
import { getExRequestsByAccountId } from "../api/exRequest.api";
import type { ExRequestResponse } from "../types/exRequestPaged";
import { getAllService } from "@/pages/staff/api/service.api";
import type { Service } from "@/pages/staff/type/service";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { 
  CreditCard, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight,
  Receipt,
  TrendingUp,
  AlertCircle,
  Package,
  DollarSign
} from "lucide-react";

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

const getPaymentStatusBadge = (status: string | undefined) => {
  if (!status) {
    return (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200 border font-medium">
        <AlertCircle className="inline mr-1" size={14} />
        Không xác định
      </Badge>
    );
  }
  
  const statusConfig = {
    "Pending": { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Chờ xử lý" },
    "Completed": { color: "bg-green-100 text-green-800 border-green-200", text: "Hoàn thành" },
    "Failed": { color: "bg-red-100 text-red-800 border-red-200", text: "Thất bại" },
    "Cancelled": { color: "bg-gray-100 text-gray-800 border-gray-200", text: "Đã hủy" },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || { 
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    text: "Không xác định" 
  };
  
  return (
    <Badge className={`${config.color} border font-medium`}>
      {status === "Completed" ? (
        <CheckCircle className="inline mr-1" size={14} />
      ) : status === "Failed" ? (
        <XCircle className="inline mr-1" size={14} />
      ) : (
        <Clock className="inline mr-1" size={14} />
      )}
      {config.text}
    </Badge>
  );
};

const getPaymentMethodIcon = (method: string | undefined) => {
  if (!method) {
    return <CreditCard className="h-5 w-5 text-gray-600" />;
  }
  
  switch (method.toLowerCase()) {
    case "vnpay":
      return <CreditCard className="h-5 w-5 text-blue-600" />;
    case "momo":
      return <CreditCard className="h-5 w-5 text-pink-600" />;
    case "zalo":
      return <CreditCard className="h-5 w-5 text-blue-500" />;
    default:
      return <CreditCard className="h-5 w-5 text-gray-600" />;
  }
};

const PAGE_SIZE = 10;

export default function PaymentList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [specificRequest, setSpecificRequest] = useState<ExRequestResponse | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        let userId = null;
        if (token) {
          const payload = parseJwt(token);
          userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        }
        if (!userId) return;

        // Lấy danh sách services
        const serviceList = await getAllService();
        setServices(serviceList);

        // Kiểm tra xem có requestId cụ thể không
        const specificRequestId = searchParams.get('requestId');
        
        if (specificRequestId) {
          // Nếu có requestId cụ thể, lấy thông tin request đó
          const response = await getExRequestsByAccountId(Number(userId), 1, 100);
          const data = response.items || [];
          const request = data.find((item: ExRequestResponse) => 
            item.id === Number(specificRequestId) && item.statusId === "2"
          );
          
          if (request) {
            setSpecificRequest(request);
          }
        }

        // Lấy danh sách payments
        const data: PagedPaymentResponse = await getPaymentsByUserId(Number(userId), pageNumber, PAGE_SIZE);
        setPayments(data.items || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalItems || 0);
      } catch (error) {
        console.error("Lỗi khi tải danh sách payments:", error);
        setPayments([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageNumber, searchParams]);

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = payments.filter(payment => payment.status === "Completed").length;

  // Helper function để lấy thông tin service
  const getService = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  // Hàm xử lý thanh toán
  const handlePayment = (requestId: number) => {
    navigate(`/payment?requestId=${requestId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  LỊCH SỬ THANH TOÁN
                </h1>
                <p className="text-gray-600 text-sm">Theo dõi các giao dịch thanh toán xét nghiệm ADN</p>
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng giao dịch</p>
                  <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Giao dịch thành công</p>
                  <p className="text-2xl font-bold text-green-600">{completedPayments}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng tiền đã thanh toán</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {totalAmount.toLocaleString()}₫
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Specific Payment Section */}
        {specificRequest && (
          <Card className="shadow-sm mb-6 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-green-800">Thanh toán cho đơn hàng #{specificRequest.id}</h2>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Đã chấp nhận
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {getService(specificRequest.serviceId)?.name || `Dịch vụ #${specificRequest.serviceId}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getService(specificRequest.serviceId)?.description || "Dịch vụ xét nghiệm ADN"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">Ngày hẹn</p>
                      <p className="text-sm text-gray-600">
                        {new Date(specificRequest.appointmentTime).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Tổng tiền</p>
                      <p className="text-2xl font-bold text-green-600">
                        {getService(specificRequest.serviceId)?.price ? 
                          getService(specificRequest.serviceId)!.price.toLocaleString() + "₫" : 
                          "Chưa xác định"
                        }
                      </p>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                    onClick={() => handlePayment(specificRequest.id)}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Thanh toán ngay
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
                <p className="text-green-600 font-medium text-lg">Đang tải dữ liệu...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id} className="shadow-sm hover:shadow-md transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">
                              Thanh toán đơn xét nghiệm #{payment.requestId}
                            </h3>
                            <span className="hidden lg:inline text-gray-400">•</span>
                            <span className="text-lg font-semibold text-green-600">
                              {payment.amount.toLocaleString()}₫
                            </span>
                          </div>
                                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            <span className="capitalize">{payment.paymentMethod || 'Không xác định'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{payment.createAt ? new Date(payment.createAt).toLocaleString("vi-VN") : 'Không xác định'}</span>
                          </div>
                        </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getPaymentStatusBadge(payment.status || 'Unknown')}
                        <div className="text-xs text-gray-500">
                          Cập nhật: {payment.updateAt ? new Date(payment.updateAt).toLocaleString("vi-VN") : 'Không xác định'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="shadow-sm mt-8">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Page Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Hiển thị</span>
                      <span className="font-semibold text-green-600">
                        {((pageNumber - 1) * PAGE_SIZE) + 1}
                      </span>
                      <span>-</span>
                      <span className="font-semibold text-green-600">
                        {Math.min(pageNumber * PAGE_SIZE, payments.length)}
                      </span>
                      <span>trong tổng số</span>
                      <span className="font-semibold text-green-600">
                        {totalItems}
                      </span>
                      <span>giao dịch</span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                      {/* First Page */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(1)}
                      >
                        Đầu
                      </Button>

                      {/* Previous Page */}
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full"
                        disabled={pageNumber === 1}
                        onClick={() => setPageNumber(pageNumber - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pageNumber <= 3) {
                            pageNum = i + 1;
                          } else if (pageNumber >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = pageNumber - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={pageNumber === pageNum ? "default" : "outline"}
                              className={`rounded-full min-w-[40px] ${
                                pageNumber === pageNum 
                                  ? "bg-green-600 text-white hover:bg-green-700" 
                                  : "hover:bg-green-50"
                              }`}
                              onClick={() => setPageNumber(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>

                      {/* Next Page */}
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-full"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(pageNumber + 1)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>

                      {/* Last Page */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        disabled={pageNumber === totalPages}
                        onClick={() => setPageNumber(totalPages)}
                      >
                        Cuối
                      </Button>
                    </div>

                    {/* Jump to Page */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Đến trang:</span>
                      <input
                        type="number"
                        min={1}
                        max={totalPages}
                        value={pageNumber}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= totalPages) {
                            setPageNumber(value);
                          }
                        }}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">/ {totalPages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        {/* Empty State */}
        {!loading && payments.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <CreditCard className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">Chưa có lịch sử thanh toán</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Bạn chưa có giao dịch thanh toán nào hoặc tính năng này đang được phát triển.
                </p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Thông báo:</strong> Bạn chưa có giao dịch thanh toán nào. 
                    Hãy thanh toán cho các đơn hàng đã được chấp nhận để xem lịch sử ở đây.
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/customer/booking-list')}
                  className="mt-4"
                >
                  Xem danh sách đơn hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 