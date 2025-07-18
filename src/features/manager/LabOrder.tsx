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
import { CheckCircle, ChevronDown, XCircle } from "lucide-react";
import * as React from "react";
import toast, { Toaster } from "react-hot-toast";
import { getStaffList, type Staff } from "./api/getAllStaff.api.ts";
import { getAllRequests, type Request } from "./api/getAllRequest.api.ts";
import ViewDetail from "./RequestDetail.tsx";

// Định nghĩa kiểu dữ liệu
type LabOrder = {
  id: string;
  customerName: string;
  serviceType: string;
  sampleMethod: string;
  status: "New" | "Processed" | "Assigned";
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
      : request.staffId !== 0
      ? "Assigned"
      : "Processed",
  assignedStaff: request.staffId !== 0 ? request.staffName : undefined,
  assignedStaffId: request.staffId !== 0 ? request.staffId : undefined,
  createdAt: request.createAt,
  updatedAt: request.updateAt,
});

const LabOrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"New" | "Processed" | "Assigned">("New");
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
    } else {
      return orders
        .filter((order) => order.status === "Assigned")
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

  const processAction = (orderId: string, action: "accepted" | "rejected") => {
    setIsLoading(true);
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: action === "accepted" ? "Processed" : "New",
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
                statusId: action === "accepted" ? "2" : "1",
                statusName: action === "accepted" ? "Accepted" : "Not Accept",
                updateAt: new Date().toISOString(),
              }
            : request
        )
      );
      toast.success(
        `Đã ${action === "accepted" ? "chấp nhận" : "từ chối"} đơn xét nghiệm ID: ${orderId}`,
        { position: "top-right", duration: 3000 }
      );
    } catch (error) {
      console.error("Lỗi khi xử lý hành động:", error);
      toast.error("Lỗi khi xử lý hành động", { position: "top-right", duration: 3000 });
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
  const assignStaff = (orderId: string, staff: Staff) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              assignedStaff: staff.fullName || staff.email,
              assignedStaffId: staff.id,
              status: "Assigned",
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
              staffId: staff.id,
              staffName: staff.fullName || staff.email,
              statusId: "2",
              statusName: "Accepted",
              updateAt: new Date().toISOString(),
            }
          : request
      )
    );
    toast.success(`Đã phân công nhân viên cho đơn ID: ${orderId}`, { position: "top-right", duration: 3000 });
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
        variant="link"
        className="text-blue-500 p-0 underline hover:text-blue-700"
        onClick={() => handleViewDetail(order)}
      >
        Xem chi tiết
      </Button>
    );
  };

  // Nút trạng thái
  const StatusButton = ({ order }: { order: LabOrder }) => {
    if (activeTab === "New") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="w-[90px] px-2 h-7 text-sm">
              Xử lý <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => handleAction(order.id, "accepted")}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" /> Chấp nhận
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction(order.id, "rejected")}
              className="flex items-center gap-2"
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
            <Button variant="default" className="w-[90px] px-2 h-7 text-sm">
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
                {staff.fullName || staff.email}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">QUẢN LÝ ĐƠN XÉT NGHIỆM</h1>
        <div className="space-y-4 relative">
          {isLoading && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button
                variant={activeTab === "New" ? "default" : "outline"}
                onClick={() => setActiveTab("New")}
                className="cursor-pointer"
              >
                ĐƠN MỚI
              </Button>
              <Button
                variant={activeTab === "Processed" ? "default" : "outline"}
                onClick={() => setActiveTab("Processed")}
                className="cursor-pointer"
              >
                ĐÃ XỬ LÝ
              </Button>
              <Button
                variant={activeTab === "Assigned" ? "default" : "outline"}
                onClick={() => setActiveTab("Assigned")}
                className="cursor-pointer"
              >
                ĐÃ PHÂN CÔNG
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[12%]">ID</TableHead>
                <TableHead className="w-[20%]">Tên khách hàng</TableHead>
                <TableHead className="w-[20%]">Loại dịch vụ</TableHead>
                <TableHead className="w-[20%]">Phương thức lấy mẫu</TableHead>
                <TableHead className="w-[12%]">Xem chi tiết</TableHead>
                <TableHead className="w-[16%]">
                  {activeTab === "New" ? "Xử lý" : activeTab === "Processed" ? "Phân công" : "Tên nhân viên"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.serviceType}</TableCell>
                  <TableCell>{order.sampleMethod}</TableCell>
                  <TableCell>
                    <ActionButton order={order} />
                  </TableCell>
                  <TableCell>
                    {activeTab === "New" || activeTab === "Processed" ? (
                      <StatusButton order={order} />
                    ) : (
                      order.assignedStaff || "Chưa phân công"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận hành động</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn{" "}
                  <strong>{dialogAction === "accepted" ? "chấp nhận" : "từ chối"}</strong>{" "}
                  đơn xét nghiệm ID: {dialogOrderId} không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={confirmAction}>Xác nhận</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isRejectReasonDialogOpen} onOpenChange={setIsRejectReasonDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Lý do từ chối</AlertDialogTitle>
                <AlertDialogDescription>
                  <Textarea
                    id="rejectReason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    className="mt-2 min-h-[100px]"
                    required
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitRejectReason}>Gửi</AlertDialogAction>
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

          <Toaster />
        </div>
      </div>
    </div>
  );
};

export default LabOrderManagement;