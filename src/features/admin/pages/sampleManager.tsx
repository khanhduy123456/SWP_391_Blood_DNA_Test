'use client';

import { useEffect, useState } from "react";
import { MoreVertical, Pencil } from "lucide-react";
import toast, { Toaster } from "react-hot-toast"; // Thêm Toaster
import type { PagedSampleResponse, SampleMethod } from "../types/method";
import { getPagedSampleMethods, deleteSampleMethod } from "../api/sample.api";
import { AddSampleMethodModal } from "./addSampleMethod";
import { UpdateSampleMethodModal } from "./updateSample";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';


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
  const [selectedMethod, setSelectedMethod] = useState<SampleMethod | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; method: SampleMethod | null }>({ open: false, method: null });
  const [sortOrder, setSortOrder] = useState<'default' | 'desc' | 'asc'>('default');

  const fetchMethods = async (pageNumber: number, pageSize: number, order: 'default' | 'desc' | 'asc' = sortOrder) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (order === 'default') {
        data = await getPagedSampleMethods(pageNumber, pageSize);
      } else {
        data = await getPagedSampleMethods(pageNumber, pageSize, order);
      }
      setMethodsData(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Lấy dữ liệu phương pháp xét nghiệm thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods(methodsData.pageNumber, methodsData.pageSize, sortOrder);
  }, [methodsData.pageNumber, methodsData.pageSize, sortOrder]);

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
   // toast.success(`"${method.name}" sample method đã được tạo thành công!`, {
   //   duration: 3000,
    //  position: "bottom-right",
 //   }
 // );
  };

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Quản lý phương pháp xét nghiệm</h2>
          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'default' | 'desc' | 'asc')}
              className="px-3 py-2 border rounded-xl text-sm text-gray-700 bg-white shadow"
            >
              <option value="default">Mặc định</option>
              <option value="desc">Mới nhất lên trên</option>
              <option value="asc">Cũ nhất lên trên</option>
            </select>
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
                                  setSelectedMethod(method);
                                  setUpdateModalOpen(true);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
                              >
                                <Pencil size={16} />
                                Chỉnh sửa
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmDelete({ open: true, method });
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-sm text-red-600 border-t border-gray-100"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Xóa
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
        {selectedMethod && (
          <UpdateSampleMethodModal
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            sampleMethodId={selectedMethod.id}
            initialName={selectedMethod.name}
            initialDescription={selectedMethod.description}
            onSuccess={() => {
              fetchMethods(methodsData.pageNumber, methodsData.pageSize);
              toast.success(`"${selectedMethod.name}" đã được cập nhật!`, {
                duration: 3000,
                position: "bottom-right",
              });
            }}
          />
        )}
        <Dialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete({ open, method: open ? confirmDelete.method : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc chắn muốn xóa phương pháp này?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-700">
              {confirmDelete.method && (
                <span>Bạn sẽ xóa phương pháp: <b>{confirmDelete.method.name}</b></span>
              )}
            </div>
            <DialogFooter className="mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmDelete({ open: false, method: null })}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (confirmDelete.method) {
                    try {
                      await deleteSampleMethod(confirmDelete.method.id);
                      toast.success(`"${confirmDelete.method.name}" đã được xoá thành công!`, {
                        duration: 3000,
                        position: "bottom-right",
                      });
                      fetchMethods(methodsData.pageNumber, methodsData.pageSize);
                    } catch {
                      toast.error("Xoá phương pháp thất bại!", {
                        duration: 3000,
                        position: "bottom-right",
                      });
                    }
                  }
                  setConfirmDelete({ open: false, method: null });
                }}
              >
                Xác nhận xóa
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Toaster />
      </div>
    </div>
  );
}

export default SampleMethodManagement;