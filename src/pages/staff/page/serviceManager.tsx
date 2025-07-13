'use client';

import { useEffect, useState } from 'react';
import { MoreVertical, Pencil } from 'lucide-react';
import type { PagedServiceResponse } from '../api/service.api';
import type { Service } from '../type/service';
import { getPagedService, deleteService } from '../api/service.api';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { UpdateServiceModal } from '../component/updateServiceModal';
import { AddServiceModal } from '../component/addService';

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

function ServiceManager() {
  const [servicesData, setServicesData] = useState<PagedServiceResponse>({
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
  const [isAddServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; service: Service | null }>({ open: false, service: null });
  const [sortOrder, setSortOrder] = useState<'default' | 'desc' | 'asc'>('default');

  const fetchServices = async (pageNumber: number, pageSize: number, order: 'default' | 'desc' | 'asc' = sortOrder) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (order === 'default') {
        data = await getPagedService(pageNumber, pageSize);
      } else {
        data = await getPagedService(pageNumber, pageSize, order);
      }
      setServicesData(data);
    } catch {
      setError('Lấy dữ liệu Service thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(servicesData.pageNumber, servicesData.pageSize, sortOrder);
  }, [servicesData.pageNumber, servicesData.pageSize, sortOrder]);

  const handlePreviousPage = () => {
    if (servicesData.hasPreviousPage) {
      setServicesData({ ...servicesData, pageNumber: servicesData.pageNumber - 1 });
    }
  };

  const handleNextPage = () => {
    if (servicesData.hasNextPage) {
      setServicesData({ ...servicesData, pageNumber: servicesData.pageNumber + 1 });
    }
  };

  const handleServiceCreated = (service: Service) => {
    fetchServices(servicesData.pageNumber, servicesData.pageSize);
    toast.success(`"${service.name}" đã được tạo thành công!`, {
      duration: 3000,
      position: 'bottom-right',
    });
  };

  return (
    <div className="p-10 bg-gradient-to-br from-green-50 to-white min-h-screen">
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-700">Quản lý dịch vụ xét nghiệm</h2>
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
              onClick={() => setAddServiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow transition"
            >
              + Thêm dịch vụ
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
                    <th className="py-3 px-5">Tên dịch vụ</th>
                    <th className="py-3 px-5">Mô tả</th>
                    <th className="py-3 px-5">Loại</th>
                    <th className="py-3 px-5">Giá (VNĐ)</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5">Cập nhật lần cuối</th>
                    <th className="py-3 px-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesData.items.length > 0 ? (
                    servicesData.items.map((service: Service) => (
                      <tr
                        key={service.id}
                        className="border-b hover:bg-green-50 transition relative"
                      >
                        <td className="py-3 px-5">{service.id}</td>
                        <td className="py-3 px-5 font-medium">{service.name}</td>
                        <td className="py-3 px-5">{service.description}</td>
                        <td className="py-3 px-5">{service.type}</td>
                        <td className="py-3 px-5">{service.price.toLocaleString('vi-VN')}</td>
                        <td className="py-3 px-5">{formatDateTime(service.createAt)}</td>
                        <td className="py-3 px-5">{formatDateTime(service.updateAt)}</td>
                        <td className="py-3 px-5 text-center relative">
                          <button
                            className="p-2 hover:bg-green-100 rounded-full"
                            onClick={() =>
                              setOpenMenuId(openMenuId === service.id ? null : service.id)
                            }
                          >
                            <MoreVertical size={20} />
                          </button>

                          {openMenuId === service.id && (
                            <div className="absolute right-5 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                              <button
                                onClick={() => {
                                  setSelectedService(service);
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
                                  setConfirmDelete({ open: true, service });
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
                      <td colSpan={8} className="text-center py-6 text-gray-500">
                        Không có dịch vụ nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {servicesData.items.length > 0 && (
                <div className="flex justify-between items-center mt-4 px-5 py-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Trang {servicesData.pageNumber} / {servicesData.totalPages} (Tổng: {servicesData.totalCount} dịch vụ)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!servicesData.hasPreviousPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        servicesData.hasPreviousPage
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Trang trước
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={!servicesData.hasNextPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        servicesData.hasNextPage
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

        <AddServiceModal
          isOpen={isAddServiceModalOpen}
          onClose={() => setAddServiceModalOpen(false)}
          onServiceCreated={handleServiceCreated}
        />

        {selectedService && (
          <UpdateServiceModal
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            serviceId={selectedService.id}
            initialName={selectedService.name}
            initialDescription={selectedService.description}
            initialType={selectedService.type}
            initialPrice={selectedService.price}
                         initialSampleMethodIds={selectedService.sampleMethodIds || []}
            onSuccess={() => {
              fetchServices(servicesData.pageNumber, servicesData.pageSize);
              toast.success(`"${selectedService.name}" đã được cập nhật!`, {
                duration: 3000,
                position: 'bottom-right',
              });
            }}
          />
        )}

        <Dialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete({ open, service: open ? confirmDelete.service : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc chắn muốn xóa dịch vụ này?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-700">
              {confirmDelete.service && (
                <span>Bạn sẽ xóa dịch vụ: <b>{confirmDelete.service.name}</b></span>
              )}
            </div>
            <DialogFooter className="mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmDelete({ open: false, service: null })}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (confirmDelete.service) {
                    try {
                      await deleteService(confirmDelete.service.id);
                      toast.success(`"${confirmDelete.service.name}" đã được xoá thành công!`, {
                        duration: 3000,
                        position: 'bottom-right',
                      });
                      fetchServices(servicesData.pageNumber, servicesData.pageSize);
                    } catch {
                      toast.error('Xoá dịch vụ thất bại!', {
                        duration: 3000,
                        position: 'bottom-right',
                      });
                    }
                  }
                  setConfirmDelete({ open: false, service: null });
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
   
export default ServiceManager;