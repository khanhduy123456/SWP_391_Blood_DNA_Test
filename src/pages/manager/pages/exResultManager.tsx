/* import React, { useEffect, useState } from "react";
import { getPagedExResults } from "../api/responeManager.api";
import type { ExResult } from "../api/responeManager.api";

const ExResultManager: React.FC = () => {
  const [results, setResults] = useState<ExResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await getPagedExResults(page, 10);
        setResults(data.items);
        setTotalPages(data.totalPages);
      } catch {
        // Có thể hiển thị lỗi nếu muốn
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [page]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Danh sách kết quả xét nghiệm ADN huyết thống</h2>
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th>ID</th>
              <th>Request ID</th>
              <th>Ngày tạo</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.requestId}</td>
                <td>{new Date(r.createAt).toLocaleString()}</td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => setSelectedFileUrl(r.fileUrl)}
                  >
                    Xem PDF
                  </button>
                  <a
                    href={r.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-2 py-1 rounded"
                    download
                  >
                    Tải về
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
              className="absolute top-2 right-2 text-xl"
              onClick={() => setSelectedFileUrl(null)}
            >
              &times;
            </button>
            <iframe
              src={selectedFileUrl}
              title="PDF Preview"
              width="100%"
              height="500px"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExResultManager;  */