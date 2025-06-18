'use client';

import { useEffect, useState } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // Thêm Toaster
import type { PagedSampleResponse, SampleMethod } from "../types/method";
import { getPagedSampleMethods } from "../api/sample.api";
import { AddSampleMethodModal } from "./addSampleMethod";


function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
function SampleMethodManagement() {
  const [methodsData, setMethodsData] = useState<PagedSampleResponse>({
    items: [],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 5,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isAddSampleModalOpen, setAddSampleModalOpen] = useState(false);

  const fetchMethods = async (pageNumber: number, pageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPagedSampleMethods(pageNumber, pageSize);
      setMethodsData(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Lấy dữ liệu phương pháp xét nghiệm thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods(methodsData.pageNumber, methodsData.pageSize);
  }, [methodsData.pageNumber, methodsData.pageSize]);

  const handlePreviousPage = () => {
    if (methodsData.hasPreviousPage) {
      setMethodsData({ ...methodsData, pageNumber: methodsData.pageNumber - 1 });
    }
  };

  const handleNextPage = () => {
    if (methodsData.hasNextPage) {
      setMethodsData({ ...methodsData, pageNumber: methodsData.pageNumber + 1 });
    }
  };

  const handleMethodCreated = (method: SampleMethod) => {
    console.log("New method created:", method);
    fetchMethods(methodsData.pageNumber, methodsData.pageSize);
    toast.success(`Phương pháp "${method.name}" đã được tạo thành công!`, {
      duration: 3000,
      position: "bottom-right",
    });
  };

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Quản lý phương pháp xét nghiệm</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setAddSampleModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow transition"
            >
              + Thêm phương pháp
            </button>
          </div>
        </div>

        <div className="overflow-x-auto relative z-0 rounded-xl shadow-lg border border-green-100 bg-white min-h-[300px]">
          {loading && (
            <div className="text-center py-10 text-green-600 font-semibold">
              Đang tải dữ liệu...
            </div>
          )}

          {error && (
            <div className="text-center py-10 text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <table className="min-w-full text-sm text-left relative z-0">
                <thead>
                  <tr className="bg-green-100 text-green-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-5">Tên phương pháp</th>
                    <th className="py-3 px-5">Mô tả</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5">Cập nhật lần cuối</th>
                    <th className="py-3 px-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {methodsData.items.length > 0 ? (
                    methodsData.items.map((method) => (
                      <tr
                        key={method.id}
                        className="border-b hover:bg-green-50 transition relative"
                      >
                        <td className="py-3 px-5">{method.id}</td>
                        <td className="py-3 px-5 font-medium">{method.name}</td>
                        <td className="py-3 px-5">{method.description}</td>
                        <td className="py-3 px-5">{formatDateTime(method.createAt)}</td>
                        <td className="py-3 px-5">{formatDateTime(method.updateAt)}</td>
                        <td className="py-3 px-5 text-center relative">
                          <button
                            className="p-2 hover:bg-green-100 rounded-full"
                            onClick={() =>
                              setOpenMenuId(openMenuId === method.id ? null : method.id)
                            }
                          >
                            <MoreVertical size={20} />
                          </button>

                          {openMenuId === method.id && (
                            <div className="absolute right-5 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <button
                                onClick={() => {
                                  alert(`Chỉnh sửa: ${method.name}`);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                              >
                                <Pencil size={16} />
                                Chỉnh sửa
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-500">
                        Không có phương pháp nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {methodsData.items.length > 0 && (
                <div className="flex justify-between items-center mt-4 px-5 py-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Trang {methodsData.pageNumber} / {methodsData.totalPages} (Tổng: {methodsData.totalCount})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!methodsData.hasPreviousPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        methodsData.hasPreviousPage
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Trang trước
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={!methodsData.hasNextPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        methodsData.hasNextPage
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Trang sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <AddSampleMethodModal
          isOpen={isAddSampleModalOpen}
          onClose={() => setAddSampleModalOpen(false)}
          onSampleCreated={handleMethodCreated}
        />
        <Toaster />
      </div>
    </div>
  );
}

export default SampleMethodManagement;