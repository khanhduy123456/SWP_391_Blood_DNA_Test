'use client';

import { useEffect, useState } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import type { Kit } from "../types/kit";
import { getAllKits } from "../api/kit.api";

function KitManagement() {
  const [kits, setKits] = useState<Kit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const fetchKits = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllKits();
        setKits(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError("Lấy dữ liệu bộ KIT thất bại");
      } finally {
        setLoading(false);
      }
    };

    fetchKits();
  }, []);

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
                {kits.length > 0 ? (
                  kits.map((kit) => (
                    <tr
                      key={kit.id}
                      className="border-b hover:bg-green-50 transition relative"
                    >
                      <td className="py-3 px-5">{kit.id}</td>
                      <td className="py-3 px-5 font-medium">{kit.name}</td>
                      <td className="py-3 px-5">{kit.description}</td>
                      <td className="py-3 px-5">{kit.createAt}</td>
                      <td className="py-3 px-5">{kit.updateAt}</td>
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
                              Chỉnh sửa KIT
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
          )}
        </div>
      </div>
    </div>
  );
}

export default KitManagement;
