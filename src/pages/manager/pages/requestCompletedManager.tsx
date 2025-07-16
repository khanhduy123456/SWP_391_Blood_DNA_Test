import React, { useEffect, useState } from "react";
import { getPagedExRequests } from "../api/requestManager.api";
import type { ExRequest } from "../api/requestManager.api";
import { uploadPdfToCloudinary } from "@/shared/lib/uploadToCloudinary";
import { createExResult } from "../api/responeManager.api";
import { getUserById } from "@/features/admin/api/user.api";

const RequestCompletedManager: React.FC = () => {
  const [requests, setRequests] = useState<ExRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<ExRequest | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [userNames, setUserNames] = useState<{ [userId: number]: string }>({});

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getPagedExRequests(page, 10);
        // Lọc các request completed statusId == "5"
        const completed = data.items.filter((r) => r.statusId === "5");
        setRequests(completed);
        setTotalPages(data.totalPages);
        // Lấy tên khách hàng
        const uniqueUserIds = Array.from(new Set(completed.map((r) => r.userId)));
        const userNameMap: { [userId: number]: string } = { ...userNames };
        await Promise.all(uniqueUserIds.map(async (userId) => {
          if (!userNameMap[userId]) {
            try {
              const user = await getUserById(userId);
              userNameMap[userId] = user.name;
            } catch {
              userNameMap[userId] = "Không xác định";
            }
          }
        }));
        setUserNames(userNameMap);
      } catch {
        setMessage("Lỗi khi tải danh sách request.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedRequest || !file) return;
    setUploading(true);
    setMessage("");
    try {
      // Upload PDF lên Cloudinary
      const fileUrl = await uploadPdfToCloudinary(file);
      // Gọi API tạo ExResult
      await createExResult({
        requestId: selectedRequest.id,
        fileUrl,
        resultDate: new Date().toISOString(),
      });
      setMessage("Tải lên và lưu kết quả thành công!");
      setFile(null);
      setSelectedRequest(null);
    } catch {
      setMessage("Lỗi khi upload hoặc lưu kết quả.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-blue-700 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2C13.1046 2 14 2.89543 14 4V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V4C10 2.89543 10.8954 2 12 2Z" fill="#2563eb"/><path d="M19 7C20.1046 7 21 7.89543 21 9V15C21 16.1046 20.1046 17 19 17C17.8954 17 17 16.1046 17 15V9C17 7.89543 17.8954 7 19 7Z" fill="#2563eb"/><path d="M5 7C6.10457 7 7 7.89543 7 9V15C7 16.1046 6.10457 17 5 17C3.89543 17 3 16.1046 3 15V9C3 7.89543 3.89543 7 5 7Z" fill="#2563eb"/></svg>
        Quản lý yêu cầu đã hoàn thành
      </h2>
      <p className="mb-4 text-gray-600">Danh sách các yêu cầu xét nghiệm ADN huyết thống đã hoàn thành. Bạn có thể tải lên kết quả xét nghiệm cho từng khách hàng.</p>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <table className="min-w-full border rounded-lg overflow-hidden shadow">
            <thead className="bg-blue-100">
              <tr>
                <th>ID</th>
                <th>Tên khách hàng</th>
                <th>User ID</th>
                <th>Service ID</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-blue-50 transition">
                  <td>{req.id}</td>
                  <td>{userNames[req.userId] || "Đang tải..."}</td>
                  <td>{req.userId}</td>
                  <td>{req.serviceId}</td>
                  <td>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Tải lên kết quả ADN
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-2">
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Trang trước
            </button>
            <span>Trang {page} / {totalPages}</span>
            <button
              className="px-3 py-1 border rounded"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Trang sau
            </button>
          </div>
        </>
      )}
      {selectedRequest && (
        <div className="mt-4 border p-4 rounded-lg bg-blue-50">
          <h3 className="font-semibold text-blue-700 mb-2">Tải lên kết quả cho khách hàng #{selectedRequest.id}</h3>
          <p className="mb-2 text-gray-600">Chỉ chấp nhận file PDF. Vui lòng chọn file kết quả xét nghiệm ADN để tải lên.</p>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          {file && <span className="ml-2 text-green-700">{file.name}</span>}
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded ml-2"
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? "Đang upload..." : "Xác nhận tải lên"}
          </button>
          <button
            className="ml-2 px-3 py-1 border rounded"
            onClick={() => {
              setSelectedRequest(null);
              setFile(null);
            }}
          >
            Hủy
          </button>
        </div>
      )}
      {message && <div className={`mt-4 ${message.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>}
    </div>
  );
};

export default RequestCompletedManager; 