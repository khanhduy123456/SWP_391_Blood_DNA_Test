'use client';

import { useEffect, useState } from 'react';
import { MoreVertical, Pencil } from 'lucide-react';
import type { Kit, PagedKitResponse } from '../types/kit';
import { getPagedKits, deleteKit } from '../api/kit.api';
import { AddKitModal } from './addKitPopup';
import toast from 'react-hot-toast';
import { UpdateKitModal } from './updateKit';
import { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
  const [isAddKitModalOpen, setAddKitModalOpen] = useState(false);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; kit: Kit | null }>({ open: false, kit: null });
  const [sortOrder, setSortOrder] = useState<'default' | 'desc' | 'asc'>('default');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchKits = async (pageNumber: number, pageSize: number, order: 'default' | 'desc' | 'asc' = sortOrder) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (order === 'default') {
        data = await getPagedKits(pageNumber, pageSize, undefined, searchTerm);
      } else {
        data = await getPagedKits(pageNumber, pageSize, order, searchTerm);
      }
      setKitsData(data);
    } catch {
      setError('Lấy dữ liệu bộ KIT thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm !== '') {
      setKitsData(prev => ({ ...prev, pageNumber: 1 }));
      fetchKits(1, kitsData.pageSize, sortOrder);
    } else {
      fetchKits(kitsData.pageNumber, kitsData.pageSize, sortOrder);
    }
  }, [searchTerm, sortOrder]);

  useEffect(() => {
    if (searchTerm === '') {
      fetchKits(kitsData.pageNumber, kitsData.pageSize, sortOrder);
    }
  }, [kitsData.pageNumber, kitsData.pageSize, sortOrder]);

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

  const handleKitCreated = (kit: Kit) => {
    fetchKits(1, kitsData.pageSize);
    setKitsData(prev => ({ ...prev, pageNumber: 1 }));
    toast.success(`"${kit.name}" đã được tạo thành công!`, {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Quản lý bộ KIT</h2>
          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'default' | 'desc' | 'asc')}
              className="px-3 py-2 border rounded-xl text-sm text-gray-700 bg-white shadow-none"
            >
              <option value="default">Mặc định</option>
              <option value="desc">Mới nhất lên trên</option>
              <option value="asc">Cũ nhất lên trên</option>
            </select>
            <button
              onClick={() => setAddKitModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow transition"
            >
              + Thêm KIT
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên KIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
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
                                  setSelectedKit(kit);
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
                                  setConfirmDelete({ open: true, kit });
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
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Trang trước
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={!kitsData.hasNextPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        kitsData.hasNextPage
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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

        <AddKitModal
          isOpen={isAddKitModalOpen}
          onClose={() => setAddKitModalOpen(false)}
          onKitCreated={handleKitCreated}
        />

        {selectedKit && (
          <UpdateKitModal
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            kitId={selectedKit.id}
            initialName={selectedKit.name}
            initialDescription={selectedKit.description}
            onSuccess={() => {
              fetchKits(kitsData.pageNumber, kitsData.pageSize);
              toast.success(`"${selectedKit.name}" đã được cập nhật!`, {
                duration: 3000,
                position: 'bottom-right',
              });
            }}
          />
        )}
        <Dialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete({ open, kit: open ? confirmDelete.kit : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc chắn muốn xóa bộ KIT này?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-700">
              {confirmDelete.kit && (
                <span>Bạn sẽ xóa bộ KIT: <b>{confirmDelete.kit.name}</b></span>
              )}
            </div>
            <DialogFooter className="mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmDelete({ open: false, kit: null })}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (confirmDelete.kit) {
                    try {
                      await deleteKit(confirmDelete.kit.id);
                      toast.success(`"${confirmDelete.kit.name}" đã được xoá thành công!`, {
                        duration: 3000,
                        position: 'bottom-right',
                      });
                      fetchKits(kitsData.pageNumber, kitsData.pageSize);
                    } catch {
                      toast.error('Xoá kit thất bại!', {
                        duration: 3000,
                        position: 'bottom-right',
                      });
                    }
                  }
                  setConfirmDelete({ open: false, kit: null });
                }}
              >
                Xác nhận xóa
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
   
export default KitManagement;