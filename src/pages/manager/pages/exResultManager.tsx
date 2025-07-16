import React, { useEffect, useState } from "react";
import { getPagedExResults } from "../api/responeManager.api";
import type { ExResult } from "../api/responeManager.api";
import { getUserById } from "@/features/admin/api/user.api";

const ExResultManager: React.FC = () => {
  const [results, setResults] = useState<ExResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: number]: string }>({});

  // Định nghĩa type mở rộng cho ExResult để có userId
  type ExResultWithUser = ExResult & { userId?: number };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await getPagedExResults(page, 10);
        setResults(data.items);
        setTotalPages(data.totalPages);
        // Lấy danh sách userId từ requestId
        const requestIds = data.items.map((r) => r.requestId);
        // Gọi API lấy thông tin request để lấy userId
        const reqRes = await Promise.all(requestIds.map(async (reqId) => {
          try {
            const res = await fetch(`/api/ExRequest/${reqId}`);
            return await res.json();
          } catch {
            return null;
          }
        }));
        // Lấy userId từ request
        const userIdMap: { [requestId: number]: number } = {};
        reqRes.forEach((req) => {
          if (req && req.id) userIdMap[req.id] = req.userId;
        });
        // Lấy tên khách hàng
        const uniqueUserIds = Array.from(new Set(Object.values(userIdMap)));
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
        setResults(data.items.map((r) => ({ ...r, userId: userIdMap[r.requestId] })));
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-blue-700 flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 2C13.1046 2 14 2.89543 14 4V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V4C10 2.89543 10.8954 2 12 2Z" fill="#2563eb"/><path d="M19 7C20.1046 7 21 7.89543 21 9V15C21 16.1046 20.1046 17 19 17C17.8954 17 17 16.1046 17 15V9C17 7.89543 17.8954 7 19 7Z" fill="#2563eb"/><path d="M5 7C6.10457 7 7 7.89543 7 9V15C7 16.1046 6.10457 17 5 17C3.89543 17 3 16.1046 3 15V9C3 7.89543 3.89543 7 5 7Z" fill="#2563eb"/></svg>
        Quản lý kết quả xét nghiệm ADN huyết thống
      </h2>
      <p className="mb-4 text-gray-600">Danh sách các kết quả xét nghiệm ADN huyết thống đã được trả về cho khách hàng. Bạn có thể xem hoặc tải về kết quả dưới dạng PDF.</p>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="min-w-full border rounded-lg overflow-hidden shadow">
          <thead className="bg-blue-100">
            <tr>
              <th>ID</th>
              <th>Request ID</th>
              <th>Tên khách hàng</th>
              <th>Ngày tạo</th>
              <th>Kết quả ADN</th>
            </tr>
          </thead>
          <tbody>
            {(results as ExResultWithUser[]).map((r) => (
              <tr key={r.id} className="hover:bg-blue-50 transition">
                <td>{r.id}</td>
                <td>{r.requestId}</td>
                <td>{userNames[r.userId ?? 0] || "Đang tải..."}</td>
                <td>{new Date(r.createAt).toLocaleString()}</td>
                <td>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2"
                    onClick={() => setSelectedFileUrl(r.fileUrl)}
                  >
                    Xem kết quả
                  </button>
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                    download
                  >
                    Tải kết quả
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
      {selectedFileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-2xl w-full relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-500 hover:text-red-500"
              onClick={() => setSelectedFileUrl(null)}
              title="Đóng"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-2 text-blue-700">Xem kết quả xét nghiệm ADN</h3>
            <iframe
              src={selectedFileUrl}
              title="PDF Preview"
              width="100%"
              height="500px"
              className="border rounded"
            />
            <p className="mt-2 text-sm text-gray-500">Nhấn dấu &times; để đóng cửa sổ xem kết quả.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExResultManager;  