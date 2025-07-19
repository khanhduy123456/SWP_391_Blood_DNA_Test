import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { 
  CheckCircle, 
  ChevronDown, 
  XCircle, 
  Dna, 
  Microscope, 
  Users, 
  Clock, 
  FileText,
  Eye,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import { getStaffList, type Staff } from "./api/getAllStaff.api.ts";
import { getAllRequests, type Request } from "./api/getAllRequest.api.ts";
import { assignStaffToExRequest, acceptExRequest, cancelExRequest } from "./api/requestManager.api.ts";
import ViewDetail from "./RequestDetail.tsx";

// Định nghĩa kiểu dữ liệu
type LabOrder = {
  id: string;
  customerName: string;
  serviceType: string;
  sampleMethod: string;
  status: "New" | "Processed" | "Assigned" | "Rejected";
  assignedStaff?: string;
  assignedStaffId?: number;
  createdAt: string;
  updatedAt: string;
};

// Ánh xạ dữ liệu từ API sang LabOrder
const mapRequestToLabOrder = (request: Request): LabOrder => ({
  id: request.id.toString(),
  customerName: request.userName,
  serviceType: request.serviceName,
  sampleMethod: request.sampleMethodName,
  status:
    request.statusId === "1"
      ? "New"
      : request.statusId === "2"
      ? "Processed"
      : request.statusId === "6"
      ? "Rejected"
      : request.staffId !== 0
      ? "Assigned"
      : "Processed",
  assignedStaff: request.staffId !== 0 ? request.staffName : undefined,
  assignedStaffId: request.staffId !== 0 ? request.staffId : undefined,
  createdAt: request.createAt,
  updatedAt: request.updateAt,
});

const LabOrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"New" | "Processed" | "Assigned" | "Rejected">("New");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [orders, setOrders] = React.useState<LabOrder[]>([]);
  const [requests, setRequests] = React.useState<Request[]>([]); // Thêm state để lưu dữ liệu gốc
  const [staffList, setStaffList] = React.useState<Staff[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [isRejectReasonDialogOpen, setIsRejectReasonDialogOpen] = React.useState(false);
  const [isViewDetailOpen, setIsViewDetailOpen] = React.useState(false);
  const [selectedRequest, setSelectedRequest] = React.useState<Request | null>(null);
  const [dialogAction, setDialogAction] = React.useState<"accepted" | "rejected" | null>(null);
  const [dialogOrderId, setDialogOrderId] = React.useState<string | null>(null);
  const [rejectReason, setRejectReason] = React.useState(
    "Rất tiếc, đơn xét nghiệm không đáp ứng các tiêu chí hiện tại."
  );
  const itemsPerPage = 10;

  // Lấy danh sách nhân viên và request từ API
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [staffData, requestData] = await Promise.all([
          getStaffList(),
          getAllRequests(),
        ]);
        setStaffList(staffData);
        setRequests(requestData); // Lưu dữ liệu gốc
        setOrders(requestData.map(mapRequestToLabOrder));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Lỗi khi lấy dữ liệu", {
          position: "top-right",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc dữ liệu theo tab
  const getFilteredData = () => {
    if (activeTab === "New") {
      return orders
        .filter((order) => order.status === "New")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeTab === "Processed") {
      return orders
        .filter((order) => order.status === "Processed")
        .sort((a, b) => b.id.localeCompare(a.id));
    } else if (activeTab === "Assigned") {
      return orders
        .filter((order) => order.status === "Assigned")
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      return orders
        .filter((order) => order.status === "Rejected")
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Xử lý hành động chấp nhận/từ chối
  const handleAction = (id: string, action: "accepted" | "rejected") => {
    setDialogOrderId(id);
    setDialogAction(action);
    setIsConfirmDialogOpen(true);
  };

  const confirmAction = () => {
    if (!dialogOrderId || !dialogAction) return;

    if (dialogAction === "rejected") {
      setIsConfirmDialogOpen(false);
      setIsRejectReasonDialogOpen(true);
    } else {
      processAction(dialogOrderId, dialogAction);
    }
  };

  const processAction = async (orderId: string, action: "accepted" | "rejected") => {
    setIsLoading(true);
    try {
      if (action === "accepted") {
        // Gọi API để chấp nhận request
        const response = await acceptExRequest(parseInt(orderId));
        
        // Cập nhật state local với dữ liệu từ API response
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "Processed",
                  updatedAt: new Date(response.updatedAt).toISOString().split("T")[0],
                }
              : order
          )
        );
        
        setRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id.toString() === orderId
              ? {
                  ...request,
                  statusId: "2",
                  statusName: "Accepted",
                  updateAt: response.updatedAt,
                }
              : request
          )
        );
        
        toast.success(`Đã chấp nhận đơn xét nghiệm ID: ${orderId}`, { 
          position: "top-right", 
          duration: 3000 
        });
      } else {
        // Gọi API để từ chối/hủy request
        await cancelExRequest(parseInt(orderId));
        
        // Cập nhật state local sau khi hủy thành công
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: "Rejected",
                  updatedAt: new Date().toISOString().split("T")[0],
                }
              : order
          )
        );
        
                        setRequests((prevRequests) =>
                  prevRequests.map((request) =>
                    request.id.toString() === orderId
                      ? {
                          ...request,
                          statusId: "6",
                          statusName: "Cancelled",
                          updateAt: new Date().toISOString(),
                        }
                      : request
                  )
                );
        
        toast.success(`Đã từ chối đơn xét nghiệm ID: ${orderId}`, { 
          position: "top-right", 
          duration: 3000 
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hành động:", error);
      toast.error(
        `Lỗi khi ${action === "accepted" ? "chấp nhận" : "từ chối"} đơn xét nghiệm`, 
        { position: "top-right", duration: 4000 }
      );
    } finally {
      setIsLoading(false);
      setIsConfirmDialogOpen(false);
      setIsRejectReasonDialogOpen(false);
      setDialogOrderId(null);
      setDialogAction(null);
      setRejectReason("Rất tiếc, đơn xét nghiệm không đáp ứng các tiêu chí hiện tại.");
    }
  };

  const handleSubmitRejectReason = () => {
    if (!rejectReason.trim()) {
      toast.error("Lý do từ chối không được để trống", { position: "top-right", duration: 3000 });
      return;
    }
    if (dialogOrderId && dialogAction) {
      processAction(dialogOrderId, dialogAction);
    }
  };

  // Giao nhân viên
  const assignStaff = async (orderId: string, staff: Staff) => {
    try {
      setIsLoading(true);
      
      // Gọi API để phân công staff
      const response = await assignStaffToExRequest(parseInt(orderId), staff.id);
      
      // Cập nhật state local
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                assignedStaff: response.assignedStaff.staffName,
                assignedStaffId: response.assignedStaff.staffId,
                status: "Assigned",
                updatedAt: new Date(response.updatedAt).toISOString().split("T")[0],
              }
            : order
        )
      );
      
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id.toString() === orderId
            ? {
                ...request,
                staffId: response.assignedStaff.staffId,
                staffName: response.assignedStaff.staffName,
                statusId: "2",
                statusName: "Accepted",
                updateAt: response.updatedAt,
              }
            : request
        )
      );
      
      toast.success(`Đã phân công nhân viên ${response.assignedStaff.staffName} cho đơn ID: ${orderId}`, { 
        position: "top-right", 
        duration: 3000 
      });
    } catch (error) {
      console.error("Lỗi khi phân công nhân viên:", error);
      toast.error("Lỗi khi phân công nhân viên. Vui lòng thử lại.", { 
        position: "top-right", 
        duration: 4000 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Xem chi tiết
  const handleViewDetail = (order: LabOrder) => {
    const request = requests.find((r) => r.id.toString() === order.id);
    if (request) {
      setSelectedRequest(request);
      setIsViewDetailOpen(true);
    }
  };

  // Nút hành động
  const ActionButton = ({ order }: { order: LabOrder }) => {
    return (
      <Button
        variant="outline"
        size="sm"
        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        onClick={() => handleViewDetail(order)}
      >
        <Eye className="h-4 w-4 mr-1" />
        Chi tiết
      </Button>
    );
  };

  // Nút trạng thái
  const StatusButton = ({ order }: { order: LabOrder }) => {
    if (activeTab === "New") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-[120px] px-3 h-8 text-sm bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-1" />
              Xử lý <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleAction(order.id, "accepted")}
              className="flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" /> Chấp nhận
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction(order.id, "rejected")}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" /> Từ chối
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else if (activeTab === "Processed") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-[120px] px-3 h-8 text-sm bg-purple-600 hover:bg-purple-700">
              <Users className="h-4 w-4 mr-1" />
              Phân công <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {staffList.map((staff) => (
              <DropdownMenuItem
                key={staff.id}
                onClick={() => assignStaff(order.id, staff)}
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                <span className="font-mono text-xs text-gray-500">#{staff.id}</span>
                <span>{staff.fullName || staff.email}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return null;
  };

  // Badge trạng thái
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
      switch (status) {
        case "New":
          return { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Clock };
        case "Processed":
          return { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Microscope };
        case "Assigned":
          return { color: "bg-green-100 text-green-800 border-green-200", icon: UserCheck };
        case "Rejected":
          return { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle };
        default:
          return { color: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertTriangle };
      }
    };

    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <IconComponent className="h-3 w-3 mr-1" />
        {status === "New" ? "Mới" : status === "Processed" ? "Đã xử lý" : status === "Assigned" ? "Đã phân công" : "Đã từ chối"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <Dna className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                QUẢN LÝ ĐƠN XÉT NGHIỆM ADN
              </h1>
              <p className="text-gray-600 text-sm">Hệ thống quản lý xét nghiệm huyết thống ADN</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 relative">
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-blue-600 font-medium">Đang tải dữ liệu...</p>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  variant={activeTab === "New" ? "default" : "ghost"}
                  onClick={() => setActiveTab("New")}
                  className={`flex-1 rounded-md transition-all ${
                    activeTab === "New" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  ĐƠN MỚI
                </Button>
                <Button
                  variant={activeTab === "Processed" ? "default" : "ghost"}
                  onClick={() => setActiveTab("Processed")}
                  className={`flex-1 rounded-md transition-all ${
                    activeTab === "Processed" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Microscope className="h-4 w-4 mr-2" />
                  ĐÃ XỬ LÝ
                </Button>
                <Button
                  variant={activeTab === "Assigned" ? "default" : "ghost"}
                  onClick={() => setActiveTab("Assigned")}
                  className={`flex-1 rounded-md transition-all ${
                    activeTab === "Assigned" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  ĐÃ PHÂN CÔNG
                </Button>
                <Button
                  variant={activeTab === "Rejected" ? "default" : "ghost"}
                  onClick={() => setActiveTab("Rejected")}
                  className={`flex-1 rounded-md transition-all ${
                    activeTab === "Rejected" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  ĐÃ TỪ CHỐI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-orange-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đơn mới</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {orders.filter(order => order.status === "New").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã xử lý</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter(order => order.status === "Processed").length}
                    </p>
                  </div>
                  <Microscope className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã phân công</p>
                    <p className="text-2xl font-bold text-green-600">
                      {orders.filter(order => order.status === "Assigned").length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Đã từ chối</p>
                    <p className="text-2xl font-bold text-red-600">
                      {orders.filter(order => order.status === "Rejected").length}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Danh sách đơn xét nghiệm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                {currentItems.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[10%] font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="w-[18%] font-semibold text-gray-700">Khách hàng</TableHead>
                        <TableHead className="w-[18%] font-semibold text-gray-700">Dịch vụ ADN</TableHead>
                        <TableHead className="w-[18%] font-semibold text-gray-700">Phương thức</TableHead>
                        <TableHead className="w-[12%] font-semibold text-gray-700">Trạng thái</TableHead>
                        <TableHead className="w-[12%] font-semibold text-gray-700">Chi tiết</TableHead>
                        <TableHead className="w-[12%] font-semibold text-gray-700">
                          {activeTab === "New" ? "Xử lý" : activeTab === "Processed" ? "Phân công" : activeTab === "Assigned" ? "Nhân viên" : "Trạng thái"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.map((order) => (
                        <TableRow key={order.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="font-medium text-blue-600">#{order.id}</TableCell>
                          <TableCell className="font-medium">{order.customerName}</TableCell>
                          <TableCell className="text-gray-700">{order.serviceType}</TableCell>
                          <TableCell className="text-gray-700">{order.sampleMethod}</TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell>
                            <ActionButton order={order} />
                          </TableCell>
                                                  <TableCell>
                          {activeTab === "New" || activeTab === "Processed" ? (
                            <StatusButton order={order} />
                          ) : activeTab === "Assigned" ? (
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">{order.assignedStaff || "Chưa phân công"}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Đã từ chối</span>
                            </div>
                          )}
                        </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      {activeTab === "New" ? (
                        <Clock className="h-12 w-12 text-gray-400" />
                      ) : activeTab === "Processed" ? (
                        <Microscope className="h-12 w-12 text-gray-400" />
                      ) : activeTab === "Assigned" ? (
                        <Users className="h-12 w-12 text-gray-400" />
                      ) : (
                        <XCircle className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {activeTab === "New" 
                        ? "Không có đơn xét nghiệm mới" 
                        : activeTab === "Processed" 
                        ? "Không có đơn đã xử lý" 
                        : activeTab === "Assigned"
                        ? "Không có đơn đã phân công"
                        : "Không có đơn đã từ chối"
                      }
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {activeTab === "New" 
                        ? "Hiện tại chưa có đơn xét nghiệm ADN mới nào cần xử lý. Vui lòng kiểm tra lại sau."
                        : activeTab === "Processed" 
                        ? "Hiện tại chưa có đơn xét nghiệm ADN nào đã được xử lý. Các đơn mới sẽ xuất hiện ở đây sau khi được chấp nhận."
                        : activeTab === "Assigned"
                        ? "Hiện tại chưa có đơn xét nghiệm ADN nào đã được phân công cho nhân viên. Các đơn đã xử lý sẽ xuất hiện ở đây sau khi được phân công."
                        : "Hiện tại chưa có đơn xét nghiệm ADN nào đã bị từ chối. Các đơn từ chối sẽ xuất hiện ở đây sau khi được xử lý."
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && currentItems.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "hover:bg-blue-50"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(i + 1)}
                            isActive={currentPage === i + 1}
                            className={currentPage === i + 1 ? "bg-blue-600 text-white" : "hover:bg-blue-50"}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "hover:bg-blue-50"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dialogs */}
          <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <AlertDialogContent className="border-2 border-blue-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-blue-600">
                  <Dna className="h-5 w-5" />
                  Xác nhận hành động
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  Bạn có chắc chắn muốn{" "}
                  <strong className="text-blue-600">{dialogAction === "accepted" ? "chấp nhận" : "từ chối"}</strong>{" "}
                  đơn xét nghiệm ADN ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">#{dialogOrderId}</span> không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">Hủy</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmAction}
                  className={dialogAction === "accepted" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                >
                  Xác nhận
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isRejectReasonDialogOpen} onOpenChange={setIsRejectReasonDialogOpen}>
            <AlertDialogContent className="border-2 border-red-200">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Lý do từ chối
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-600">
                  <Textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối đơn xét nghiệm ADN..."
                    className="mt-2 min-h-[100px] border-gray-300 focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitRejectReason} className="bg-red-600 hover:bg-red-700">
                  Gửi
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {selectedRequest && (
            <ViewDetail
              open={isViewDetailOpen}
              onOpenChange={setIsViewDetailOpen}
              request={selectedRequest}
            />
          )}

          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LabOrderManagement;