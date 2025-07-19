import React, { useEffect, useState } from "react";
import { getExRequestsByStaffId } from "../api/exRequestStaff.api";
import { getStaffIdByUserId } from "../api/staff.api";
import { createExResult, getExResultByRequestId, updateExResult, type ExResult } from "../api/responeStaff.api";
import { uploadPdfToCloudinary } from "@/shared/lib/uploadToCloudinary";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Dna } from 'lucide-react';

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

const ResultUploadManager: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [exResults, setExResults] = useState<Record<number, ExResult>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // true: update, false: create

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy userId từ accessToken
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Không tìm thấy access token");
        const payload = parseJwt(token);
        const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (!userId) throw new Error("Không thể lấy userId từ token");
        // Lấy staffId từ userId
        const staffData = await getStaffIdByUserId(Number(userId));
        const staffId = staffData.staffId;
        // Lấy danh sách request đã phân công
        const reqs = await getExRequestsByStaffId(staffId);
        // Chỉ hiển thị những request có trạng thái Completed (statusId = 5)
        const completedRequests = reqs.filter(req => req.statusId === '5');
        setRequests(completedRequests);
        // Lấy kết quả xét nghiệm (nếu có) cho từng request đã hoàn thành
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resultPromises = completedRequests.map(async (req: any) => {
          try {
            const result = await getExResultByRequestId(req.id);
            return { requestId: req.id, result };
          } catch {
            return { requestId: req.id, result: null };
          }
        });
        const results = await Promise.all(resultPromises);
        const resultMap: Record<number, ExResult> = {};
        results.forEach(r => { if (r.result) resultMap[r.requestId] = r.result; });
        setExResults(resultMap);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedRequest || !file) return;
    setUploading(true);
    try {
      // Upload PDF lên Cloudinary
      const fileUrl = await uploadPdfToCloudinary(file);
      if (isEditMode && exResults[selectedRequest.id]) {
        // Update kết quả (PUT)
        await updateExResult(exResults[selectedRequest.id].id, {
          fileUrl,
          resultDate: new Date().toISOString(),
        });
        toast.success("Cập nhật kết quả thành công!");
      } else {
        // Tạo mới kết quả (POST)
        await createExResult({
          requestId: selectedRequest.id,
          fileUrl,
          resultDate: new Date().toISOString(),
        });
        toast.success("Tải lên và lưu kết quả thành công!");
      }
      setFile(null);
      setSelectedRequest(null);
      setIsDialogOpen(false);
      setIsEditMode(false);
      // Refresh kết quả
      try {
        const result = await getExResultByRequestId(selectedRequest.id);
        setExResults(prev => ({ ...prev, [selectedRequest.id]: result }));
      } catch {
        setExResults(prev => {
          const newMap = { ...prev };
          delete newMap[selectedRequest.id];
          return newMap;
        });
      }
    } catch {
      toast.error("Lỗi khi upload hoặc lưu kết quả.");
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-100 rounded-full p-3 flex items-center justify-center">
          <Dna className="w-8 h-8 text-blue-700" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900 tracking-tight">Upload Kết Quả Xét Nghiệm ADN</h2>
          <p className="text-blue-700 text-sm md:text-base font-medium mt-1">Danh sách các yêu cầu xét nghiệm ADN đã hoàn thành (trạng thái "Completed"). Bạn có thể tải lên hoặc chỉnh sửa kết quả xét nghiệm (PDF) cho từng khách hàng.</p>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-16 text-blue-700 font-semibold text-lg animate-pulse">Đang tải dữ liệu...</div>
      ) : (
        <div className="space-y-6">
          {requests.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              <div className="mb-4">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có yêu cầu hoàn thành</h3>
                <p className="text-gray-600">Hiện tại chưa có yêu cầu xét nghiệm nào đã hoàn thành để upload kết quả.</p>
                <p className="text-gray-500 text-sm mt-2">Chỉ những yêu cầu có trạng thái "Hoàn thành" mới được hiển thị ở đây.</p>
              </div>
            </div>
          )}
          {requests.map((req) => (
            <div key={req.id} className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow border border-blue-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap gap-4 items-center mb-2">
                  <span className="font-semibold text-blue-900 text-lg">Yêu cầu #{req.id}</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded text-xs font-bold">✅ {req.statusName}</span>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-bold">{req.serviceName || req.serviceId}</span>
                  <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs font-bold">{req.sampleMethodName}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  <div><span className="font-semibold">👤 Khách hàng:</span> {req.userName || req.userId}</div>
                  <div><span className="font-semibold">📅 Ngày hẹn:</span> {formatDateTime(req.appointmentTime)}</div>
                  <div><span className="font-semibold">🕒 Ngày tạo:</span> {formatDateTime(req.createAt)}</div>
                  <div><span className="font-semibold">📝 Ngày cập nhật:</span> {formatDateTime(req.updateAt)}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 min-w-[200px]">
                <div>
                  {exResults[req.id] ? (
                    <>
                      <a
                        href={exResults[req.id].fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline font-semibold mr-2"
                      >
                        Xem kết quả
                      </a>
                      <a
                        href={exResults[req.id].fileUrl}
                        download
                        className="text-green-700 underline font-semibold mr-2"
                      >
                        Tải về
                      </a>
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-semibold"
                        onClick={() => {
                          setSelectedRequest(req);
                          setIsDialogOpen(true);
                          setIsEditMode(true);
                        }}
                      >
                        Chỉnh sửa kết quả
                      </Button>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Chưa có kết quả</span>
                  )}
                </div>
                <div>
                  {!exResults[req.id] && (
                    <Button
                      className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded font-semibold"
                      onClick={() => {
                        setSelectedRequest(req);
                        setIsDialogOpen(true);
                        setIsEditMode(false);
                      }}
                    >
                      Tải lên kết quả
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          setSelectedRequest(null);
          setFile(null);
          setIsEditMode(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Chỉnh sửa kết quả xét nghiệm huyết thống ADN' : 'Tải lên kết quả xét nghiệm huyết thống ADN'}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="mb-2 text-gray-700 text-sm space-y-1">
              <div><span className="font-semibold">Yêu cầu:</span> #{selectedRequest.id}</div>
              <div><span className="font-semibold">Khách hàng:</span> {selectedRequest.userName || selectedRequest.userId}</div>
              <div><span className="font-semibold">Dịch vụ:</span> {selectedRequest.serviceName || selectedRequest.serviceId}</div>
              <div><span className="font-semibold">Phương thức lấy mẫu:</span> {selectedRequest.sampleMethodName}</div>
              <div><span className="font-semibold">Ngày hẹn:</span> {formatDateTime(selectedRequest.appointmentTime)}</div>
              <div><span className="font-semibold">Trạng thái:</span> {selectedRequest.statusName}</div>
            </div>
          )}
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {file && <span className="ml-2 text-green-700 font-semibold">{file.name}</span>}
          <DialogFooter className="pt-4">
            <Button
              className="bg-green-700 hover:bg-green-800 text-white font-semibold"
              onClick={handleUpload}
              disabled={uploading || !file}
            >
              {uploading ? (isEditMode ? 'Đang cập nhật...' : 'Đang upload...') : (isEditMode ? 'Cập nhật kết quả' : 'Xác nhận tải lên')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setSelectedRequest(null);
                setFile(null);
                setIsEditMode(false);
              }}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResultUploadManager; 