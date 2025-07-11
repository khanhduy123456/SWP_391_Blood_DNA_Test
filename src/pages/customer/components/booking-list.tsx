import { useEffect, useState } from "react";
import { getExRequestsByAccountId } from "../api/exRequest.api";
import type { ExRequestResponse, PagedExRequestResponse } from "../types/exRequestPaged";
import { getAllService } from "@/pages/staff/api/service.api";
import { getAllSampleMethods } from "@/features/admin/api/sample.api";
import type { Service } from "@/pages/staff/type/service";
import type { SampleMethod } from "@/features/admin/types/method";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/shared/ui/accordion";
import { Button } from "@/shared/ui/button";
import { CheckCircleIcon, XCircleIcon, ClockIcon, FlaskConicalIcon, UserCircle2Icon, ChevronLeft, ChevronRight } from "lucide-react";

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

const statusIcon = (status: string) => {
  if (status === "Accepted") return <CheckCircleIcon className="inline mr-1 text-green-600" size={18} />;
  if (status === "Not Accept") return <XCircleIcon className="inline mr-1 text-red-600" size={18} />;
  return <ClockIcon className="inline mr-1 text-yellow-500" size={18} />;
};

const PAGE_SIZE = 5;

export default function BookingList() {
  const [requests, setRequests] = useState<ExRequestResponse[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sampleMethods, setSampleMethods] = useState<SampleMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

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
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pageNumber, sortOrder]);

  const getService = (id: number) => services.find(s => s.id === id);
  const getSampleMethod = (id: number) => sampleMethods.find(m => m.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-2 md:px-0">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-6 md:p-10 border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <FlaskConicalIcon className="text-blue-700" size={36} />
            <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Lịch sử đặt dịch vụ xét nghiệm ADN</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sắp xếp:</span>
            <select
              className="border rounded px-2 py-1 text-sm focus:outline-blue-400"
              value={sortOrder}
              onChange={e => { setSortOrder(e.target.value as 'desc' | 'asc'); setPageNumber(1); }}
            >
              <option value="desc">Mới nhất lên trước</option>
              <option value="asc">Cũ nhất lên trước</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-16 text-blue-700 font-semibold text-lg animate-pulse">Đang tải dữ liệu...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">Bạn chưa có lịch đặt nào.</div>
        ) : (
          <>
            <Accordion type="multiple" className="space-y-4">
              {requests.map((req) => {
                const service = getService(req.serviceId);
                const sampleMethod = getSampleMethod(req.sampleMethodId);
                return (
                  <AccordionItem key={req.id} value={req.id.toString()} className="bg-gradient-to-r from-blue-100/60 to-white rounded-xl border border-blue-200 shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 min-w-0 w-full">
                        <div className="bg-blue-200 rounded-full p-2 self-start md:self-center">
                          <UserCircle2Icon className="text-blue-700" size={32} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <span className="font-bold text-blue-900 text-lg md:text-xl">{service?.name || `#${req.serviceId}`}</span>
                            <span className="mx-2 hidden md:inline text-gray-400">|</span>
                            <span className="font-semibold text-blue-700 text-base md:text-lg">{sampleMethod?.name || `#${req.sampleMethodId}`}</span>
                          </div>
                          <div className="mt-1 text-sm md:text-base font-medium text-indigo-700 flex items-center gap-1">
                            <ClockIcon size={16} className="inline text-indigo-500" />
                            {new Date(req.appointmentTime).toLocaleString("vi-VN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        {statusIcon(req.statusId)}
                        <span className={
                          req.statusId === "Not Accept"
                            ? "text-red-600 font-semibold"
                            : req.statusId === "Accepted"
                            ? "text-green-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }>
                          {req.statusId}
                        </span>
                        {req.statusId === "Not Accept" && (
                          <Button size="sm" variant="outline" className="ml-4 text-xs px-3 py-1 border-blue-500 text-blue-700 hover:bg-blue-50">
                            Chỉnh sửa
                          </Button>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-white border-t px-8 pb-4 pt-2">
                      <div className="py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Dịch vụ:</span> {service?.description || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Phương pháp lấy mẫu:</span> {sampleMethod?.description || "-"}
                        </div>
                        <div>
                          <span className="font-medium">Giá dịch vụ:</span> {service?.price ? service.price.toLocaleString() + "₫" : "-"}
                        </div>
                        <div>
                          <span className="font-medium">Ngày tạo:</span> {new Date(req.createAt).toLocaleString("vi-VN")}
                        </div>
                        <div>
                          <span className="font-medium">Ngày cập nhật:</span> {new Date(req.updateAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(pageNumber - 1)}
              >
                <ChevronLeft />
              </Button>
              <span className="font-semibold text-blue-900 text-base">
                Trang {pageNumber} / {totalPages}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={pageNumber === totalPages}
                onClick={() => setPageNumber(pageNumber + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
