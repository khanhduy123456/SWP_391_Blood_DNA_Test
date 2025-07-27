import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExRequestsByAccountId } from "../api/exRequest.api";
import type { ExRequestResponse, PagedExRequestResponse } from "../types/exRequestPaged";
import { getAllService } from "@/pages/staff/api/service.api";
import { getAllSampleMethods } from "@/features/admin/api/sample.api";
import type { Service } from "@/pages/staff/type/service";
import type { SampleMethod } from "@/features/admin/types/method";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  Dna, 
  ChevronLeft, 
  ChevronRight, 
  Trash2Icon, 
  PackageIcon, 
  TruckIcon,
  Microscope,
  FlaskConical,
  Calendar,
  DollarSign,
  FileText,
  Edit3,
  Eye,
  CheckCircle,
  CreditCard
} from "lucide-react";
import UpdateBooking from "../components/update-booking";
import DeleteBooking from "../components/delete-booking";
import { Toaster } from "react-hot-toast";
import { getKitDeliveryByRequestId, acknowledgeKitDeliveryStatus, type KitDelivery } from "@/pages/staff/api/delivery.api";
import { getPaymentsByUserId } from "../api/payment.api";
import toast from "react-hot-toast";

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

const statusIcon = (statusName: string) => {
  if (statusName === "Accepted") return <CheckCircleIcon className="inline mr-1 text-green-600" size={18} />;
  if (statusName === "Not Accept") return <XCircleIcon className="inline mr-1 text-red-600" size={18} />;
  if (statusName === "SampleCollected") return <PackageIcon className="inline mr-1 text-blue-600" size={18} />;
  if (statusName === "Processing") return <Microscope className="inline mr-1 text-purple-600" size={18} />;
  if (statusName === "Completed") return <CheckCircleIcon className="inline mr-1 text-emerald-600" size={18} />;
  return <ClockIcon className="inline mr-1 text-yellow-500" size={18} />;
};

const getStatusBadge = (statusId: string) => {
  const statusConfig = {
    "1": { color: "bg-red-100 text-red-800 border-red-200", text: "Chờ xử lý" },
    "2": { color: "bg-green-100 text-green-800 border-green-200", text: "Đã chấp nhận" },
    "3": { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Đã thu mẫu" },
    "4": { color: "bg-purple-100 text-purple-800 border-purple-200", text: "Đang xử lý" },
    "5": { color: "bg-emerald-100 text-emerald-800 border-emerald-200", text: "Hoàn thành" },
    "6": { color: "bg-red-100 text-red-800 border-red-200", text: "Đã từ chối" },
  };
  
  const config = statusConfig[statusId as keyof typeof statusConfig] || { 
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    text: "Không xác định" 
  };
  
  return (
    <Badge className={`${config.color} border font-medium`}>
      {statusIcon(requestStatusMap[statusId] || "Unknown")}
      {config.text}
    </Badge>
  );
};

const PAGE_SIZE = 5;

// Mapping trạng thái request (ExRequest)
const requestStatusMap: Record<string, string> = {
  "1": "Not Accept",
  "2": "Accepted",
  "3": "SampleCollected",
  "4": "Processing",
  "5": "Completed",
};

// Mapping trạng thái kit delivery
const kitDeliveryStatusMap: Record<string, string> = {
  "Pending": "Chờ xử lý",
  "Sent": "Đã gửi đến nhà",
  "Received": "Người dùng đã nhận",
  "Returned": "Đã gửi lại cơ sở",
};

export default function BookingList() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ExRequestResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sampleMethods, setSampleMethods] = useState<SampleMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedBooking, setSelectedBooking] = useState<ExRequestResponse | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [kitDeliveries, setKitDeliveries] = useState<Record<number, KitDelivery>>({});
  const [successfulPaymentRequestIds, setSuccessfulPaymentRequestIds] = useState<number[]>([]);

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
        // Gọi API lấy danh sách booking với phân trang và sort
        const data: PagedExRequestResponse = await getExRequestsByAccountId(Number(userId), pageNumber, PAGE_SIZE);
        let items = data.items || [];
        // Sắp xếp client nếu cần
        if (sortOrder === 'desc') {
          items = items.slice().sort((a, b) => new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime());
        } else {
          items = items.slice().sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());
        }
        setRequests(items);
        setTotalPages(data.totalPages || 1);
        const [serviceList, sampleMethodList] = await Promise.all([
          getAllService(),
          getAllSampleMethods(),
        ]);
        setServices(serviceList);
        setSampleMethods(sampleMethodList);
        
        // Lấy danh sách payments của user
        try {
          const paymentsData = await getPaymentsByUserId(Number(userId), 1, 1000); // Lấy tất cả payments
          const successfulIds = paymentsData.items
            ?.filter(payment => payment.status === "Success" || payment.status === "Completed")
            ?.map(payment => payment.requestId) || [];
          setSuccessfulPaymentRequestIds(successfulIds);
        } catch (error) {
          console.log("Không có payments hoặc lỗi khi tải payments:", error);
          setSuccessfulPaymentRequestIds([]);
        }
        
        // Lấy thông tin kit delivery cho các request có methodId = 2
        const deliveryRequests = items.filter(req => req.sampleMethodId === 2);
        const deliveryPromises = deliveryRequests.map(async (req) => {
          try {
            const delivery = await getKitDeliveryByRequestId(req.id);
            return { requestId: req.id, delivery };
          } catch {
            console.log(`Không tìm thấy kit delivery cho request ${req.id}`);
            return { requestId: req.id, delivery: null };
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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageNumber, sortOrder]);

  const getService = (id: number) => services.find(s => s.id === id);
  const getSampleMethod = (id: number) => sampleMethods.find(m => m.id === id);

  const handleEditBooking = (booking: ExRequestResponse) => {
    setSelectedBooking(booking);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteBooking = (booking: ExRequestResponse) => {
    setSelectedBooking(booking);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSuccess = () => {
    // Refresh data after successful update
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        let userId = null;
        if (token) {
          const payload = parseJwt(token);
          userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        }
        if (!userId) return;
        const data: PagedExRequestResponse = await getExRequestsByAccountId(Number(userId), pageNumber, PAGE_SIZE);
        let items = data.items || [];
        if (sortOrder === 'desc') {
          items = items.slice().sort((a, b) => new Date(b.appointmentTime).getTime() - new Date(a.appointmentTime).getTime());
        } else {
          items = items.slice().sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());
        }
        setRequests(items);
        setTotalPages(data.totalPages || 1);
        
        // Lấy lại danh sách payments của user
        try {
          const paymentsData = await getPaymentsByUserId(Number(userId), 1, 1000);
          const successfulIds = paymentsData.items
            ?.filter(payment => payment.status === "Success" || payment.status === "Completed")
            ?.map(payment => payment.requestId) || [];
          setSuccessfulPaymentRequestIds(successfulIds);
        } catch (error) {
          console.log("Không có payments hoặc lỗi khi tải payments:", error);
          setSuccessfulPaymentRequestIds([]);
        }
        
        // Lấy thông tin kit delivery cho các request có methodId = 2
        const deliveryRequests = items.filter(req => req.sampleMethodId === 2);
        const deliveryPromises = deliveryRequests.map(async (req) => {
          try {
            const delivery = await getKitDeliveryByRequestId(req.id);
            return { requestId: req.id, delivery };
          } catch {
            console.log(`Không tìm thấy kit delivery cho request ${req.id}`);
            return { requestId: req.id, delivery: null };
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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Dna className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LỊCH SỬ XÉT NGHIỆM ADN
                </h1>
                <p className="text-gray-600 text-sm">Theo dõi quá trình xét nghiệm huyết thống ADN của bạn</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-green-500 text-green-700 hover:bg-green-50"
              onClick={() => navigate('/customer/payment-list')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Xem lịch sử thanh toán
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng đơn</p>
                  <p className="text-2xl font-bold text-blue-600">{requests.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đã chấp nhận</p>
                  <p className="text-2xl font-bold text-green-600">
                    {requests.filter(req => req.statusId === "2").length}
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Đang xử lý</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {requests.filter(req => req.statusId === "4").length}
                  </p>
                </div>
                <Microscope className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {requests.filter(req => req.statusId === "5").length}
                  </p>
                </div>
                <FlaskConical className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={sortOrder}
                  onChange={e => { setSortOrder(e.target.value as 'desc' | 'asc'); setPageNumber(1); }}
                >
                  <option value="desc">Mới nhất lên trước</option>
                  <option value="asc">Cũ nhất lên trước</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Hiển thị {requests.length} đơn xét nghiệm
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-blue-600 font-medium text-lg">Đang tải dữ liệu...</p>
              </div>
            </CardContent>
          </Card>
        ) : requests.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-16">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Dna className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600">Chưa có đơn xét nghiệm nào</h3>
                <p className="text-gray-500 text-center max-w-md">
                  Bạn chưa có lịch đặt xét nghiệm ADN nào. Hãy đặt lịch để bắt đầu quá trình xét nghiệm.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {requests.map((req) => {
                const service = getService(req.serviceId);
                const sampleMethod = getSampleMethod(req.sampleMethodId);
                return (
                  <Card key={req.id} className="shadow-sm hover:shadow-md transition-shadow border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                            <FlaskConical className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{service?.name || `Dịch vụ #${req.serviceId}`}</h3>
                              <span className="hidden lg:inline text-gray-400">•</span>
                              <span className="text-lg font-semibold text-blue-600">{sampleMethod?.name || `Phương pháp #${req.sampleMethodId}`}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(req.appointmentTime).toLocaleString("vi-VN")}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          {getStatusBadge(req.statusId)}
                          {req.statusId === "1" && (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs px-3 py-1 border-blue-500 text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEditBooking(req)}
                              >
                                <Edit3 size={14} className="mr-1" />
                                Chỉnh sửa
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs px-3 py-1 border-red-500 text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteBooking(req)}
                              >
                                <Trash2Icon size={14} className="mr-1" />
                                Xóa
                              </Button>
                            </div>
                          )}
                          {req.statusId === "2" && !successfulPaymentRequestIds.includes(req.id) && (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="default" 
                                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => navigate(`/customer/payment-list?requestId=${req.id}`)}
                              >
                                <DollarSign size={14} className="mr-1" />
                                Thanh toán
                              </Button>
                            </div>
                          )}
                          {req.statusId === "2" && successfulPaymentRequestIds.includes(req.id) && (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle size={14} className="mr-1" />
                                Đã thanh toán
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Accordion type="single" collapsible>
                        <AccordionItem value="details" className="border-0">
                          <AccordionTrigger className="py-2 hover:no-underline">
                            <span className="text-sm font-medium text-blue-600 flex items-center gap-2">
                              <Eye size={16} />
                              Xem chi tiết
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Mô tả dịch vụ</p>
                                    <p className="text-sm text-gray-600">{service?.description || "Không có mô tả"}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <PackageIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Phương pháp lấy mẫu</p>
                                    <p className="text-sm text-gray-600">{sampleMethod?.description || "Không có mô tả"}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Giá dịch vụ</p>
                                    <p className="text-sm text-gray-600 font-semibold">
                                      {service?.price ? service.price.toLocaleString() + "₫" : "Chưa cập nhật"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Ngày tạo</p>
                                    <p className="text-sm text-gray-600">{new Date(req.createAt).toLocaleString("vi-VN")}</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-gray-900">Cập nhật lần cuối</p>
                                    <p className="text-sm text-gray-600">{new Date(req.updateAt).toLocaleString("vi-VN")}</p>
                                  </div>
                                </div>
                                {req.sampleMethodId === 2 && (
                                  <div className="flex items-start gap-3">
                                    <TruckIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">Trạng thái vận chuyển</p>
                                      {kitDeliveries[req.id] ? (
                                        <div className="mt-2 space-y-2">
                                          <Badge className={`${
                                            kitDeliveries[req.id].statusId === 'Pending'
                                              ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                                              : kitDeliveries[req.id].statusId === 'Sent'
                                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                                              : kitDeliveries[req.id].statusId === 'Received'
                                              ? 'bg-green-100 text-green-800 border-green-200'
                                              : kitDeliveries[req.id].statusId === 'Returned'
                                              ? 'bg-red-100 text-red-800 border-red-200'
                                              : 'bg-gray-100 text-gray-800 border-gray-200'
                                          } border`}>
                                            {kitDeliveryStatusMap[kitDeliveries[req.id].statusId] || "Không xác định"}
                                          </Badge>
                                          
                                          {/* Nút cập nhật trạng thái cho kit delivery */}
                                          {kitDeliveries[req.id].statusId === 'Sent' && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-xs px-3 py-1 border-green-500 text-green-700 hover:bg-green-50"
                                              onClick={async () => {
                                                try {
                                                  await acknowledgeKitDeliveryStatus(kitDeliveries[req.id].id, 'Received');
                                                  toast.success('Đã xác nhận nhận kit thành công!');
                                                  handleUpdateSuccess();
                                                } catch {
                                                  toast.error('Xác nhận nhận kit thất bại!');
                                                }
                                              }}
                                            >
                                              <PackageIcon size={14} className="mr-1" />
                                              Đã nhận kit
                                            </Button>
                                          )}
                                          
                                          {kitDeliveries[req.id].statusId === 'Received' && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-xs px-3 py-1 border-blue-500 text-blue-700 hover:bg-blue-50"
                                              onClick={async () => {
                                                try {
                                                  await acknowledgeKitDeliveryStatus(kitDeliveries[req.id].id, 'Returned');
                                                  toast.success('Đã xác nhận gửi lại kit thành công!');
                                                  handleUpdateSuccess();
                                                } catch {
                                                  toast.error('Xác nhận gửi lại kit thất bại!');
                                                }
                                              }}
                                            >
                                              <TruckIcon size={14} className="mr-1" />
                                              Đã gửi lại cơ sở
                                            </Button>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-gray-500">Chưa có thông tin vận chuyển</p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card className="shadow-sm mt-8">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Page Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Hiển thị</span>
                      <span className="font-semibold text-blue-600">
                        {((pageNumber - 1) * PAGE_SIZE) + 1}
                      </span>
                      <span>-</span>
                      <span className="font-semibold text-blue-600">
                        {Math.min(pageNumber * PAGE_SIZE, requests.length)}
                      </span>
                      <span>trong tổng số</span>
                      <span className="font-semibold text-blue-600">
                        {requests.length}
                      </span>
                      <span>đơn xét nghiệm</span>
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
                                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                                  : "hover:bg-blue-50"
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
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-sm text-gray-600">/ {totalPages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Update Booking Modal */}
      <UpdateBooking
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onUpdateSuccess={handleUpdateSuccess}
      />

      {/* Delete Booking Modal */}
      <DeleteBooking
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBooking(null);
        }}
        booking={selectedBooking}
        onDeleteSuccess={handleUpdateSuccess}
        services={services}
      />

      {/* Toast Container */}
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 4000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
    </div>
  );
}