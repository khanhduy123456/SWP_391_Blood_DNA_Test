'use client';

import { useEffect, useState } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import type { Kit, PagedKitResponse } from "../types/kit";
import { getPagedKits } from "../api/kit.api";

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

function KitManagement() {
  const [kitsData, setKitsData] = useState<PagedKitResponse>({
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

  const fetchKits = async (pageNumber: number, pageSize: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPagedKits(pageNumber, pageSize);
      setKitsData(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Lấy dữ liệu bộ KIT thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKits(kitsData.pageNumber, kitsData.pageSize);
  }, [kitsData.pageNumber, kitsData.pageSize]);

  const handlePreviousPage = () => {
    if (kitsData.hasPreviousPage) {
      setKitsData({ ...kitsData, pageNumber: kitsData.pageNumber - 1 });
    }
  };

  const handleNextPage = () => {
    if (kitsData.hasNextPage) {
      setKitsData({ ...kitsData, pageNumber: kitsData.pageNumber + 1 });
    }
  };

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Quản lý bộ KIT</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow transition">
            + Thêm KIT
          </button>
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
                    <th className="py-3 px-5">Tên KIT</th>
                    <th className="py-3 px-5">Mô tả</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5">Cập nhật lần cuối</th>
                    <th className="py-3 px-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {kitsData.items.length > 0 ? (
                    kitsData.items.map((kit: Kit) => (
                      <tr
                        key={kit.id}
                        className="border-b hover:bg-green-50 transition relative"
                      >
                        <td className="py-3 px-5">{kit.id}</td>
                        <td className="py-3 px-5 font-medium">{kit.name}</td>
                        <td className="py-3 px-5">{kit.description}</td>
                        <td className="py-3 px-5">{formatDateTime(kit.createAt)}</td>
                        <td className="py-3 px-5">{formatDateTime(kit.updateAt)}</td>
                        <td className="py-3 px-5 text-center relative">
                          <button
                            className="p-2 hover:bg-green-100 rounded-full"
                            onClick={() =>
                              setOpenMenuId(openMenuId === kit.id ? null : kit.id)
                            }
                          >
                            <MoreVertical size={20} />
                          </button>

                          {openMenuId === kit.id && (
                            <div className="absolute right-5 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <button
                                onClick={() => {
                                  alert(`Chỉnh sửa: ${kit.name}`);
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
                      <td colSpan={6} className="text-center py-6 text-gray-500">
                        Không có KIT nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {kitsData.items.length > 0 && (
                <div className="flex justify-between items-center mt-4 px-5 py-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Trang {kitsData.pageNumber} / {kitsData.totalPages} (Tổng: {kitsData.totalCount} kit)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!kitsData.hasPreviousPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        kitsData.hasPreviousPage
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Trang trước
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={!kitsData.hasNextPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        kitsData.hasNextPage
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
      </div>
    </div>
  );
}

export default KitManagement;