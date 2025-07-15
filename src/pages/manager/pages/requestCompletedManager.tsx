/*import React, { useEffect, useState } from "react";
import { getPagedExRequests } from "../api/requestManager.api";
import type { ExRequest } from "../api/requestManager.api";
import { uploadPdfToCloudinary } from "@/shared/lib/uploadToCloudinary";
import { createExResult } from "../api/responeManager.api";

const RequestCompletedManager: React.FC = () => {
  const [requests, setRequests] = useState<ExRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<ExRequest | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const data = await getPagedExRequests(page, 10);
        // Lọc các request completed statusId == "5"
        const completed = data.items.filter((r) => r.statusId === "5");
        setRequests(completed);
        setTotalPages(data.totalPages);
      } catch {
        setMessage("Lỗi khi tải danh sách request.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
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
      <h2 className="text-xl font-bold mb-4">Danh sách request đã hoàn thành</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <>
          <table className="min-w-full border">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Service ID</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.userId}</td>
                  <td>{req.serviceId}</td>
                  <td>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Upload kết quả
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
        <div className="mt-4 border p-4">
          <h3 className="font-semibold">Upload kết quả cho request #{selectedRequest.id}</h3>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded ml-2"
            onClick={handleUpload}
            disabled={uploading || !file}
          >
            {uploading ? "Đang upload..." : "Xác nhận upload"}
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
      {message && <div className="mt-4 text-red-500">{message}</div>}
    </div>
  );
};

export default RequestCompletedManager; */