'use client';

import { useEffect, useState } from 'react';
import { MoreVertical, Pencil, Trash2, Package, Truck, CheckCircle, Plus } from 'lucide-react';
import type { KitDelivery, PagedKitDeliveryResponse } from '../api/delivery.api';
import { getPagedKitDeliveries, deleteKitDeliveryById, updateKitDeliveryStatus } from '../api/delivery.api';
import { getAllKits } from '@/features/admin/api/kit.api';
import type { Kit } from '@/features/admin/types/kit';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { CreateKitDeliveryModal } from '../component/createKitDeliveryModal';

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

// Status mapping
const statusMapping: Record<string, { name: string; color: string; icon: React.ReactNode }> = {
  'Pending': { name: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800', icon: <Package size={16} /> },
  'Sent': { name: 'Đã gửi đến nhà', color: 'bg-orange-100 text-orange-800', icon: <Truck size={16} /> },
  'Received': { name: 'Người dùng đã nhận', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={16} /> },
  'Returned': { name: 'Người dùng đã gửi lại', color: 'bg-red-100 text-red-800', icon: <Trash2 size={16} /> }
};

// Helper lấy statusId đúng cho mọi nơi
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getStatusId = (delivery: any) => delivery.statusId || delivery.status;

function KitDeliveryManagement() {
  const [deliveriesData, setDeliveriesData] = useState<PagedKitDeliveryResponse>({
    items: [],
    pageNumber: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 5,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<KitDelivery | null>(null);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; delivery: KitDelivery | null }>({ open: false, delivery: null });
  const [sortOrder, setSortOrder] = useState<'default' | 'desc' | 'asc'>('default');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [kits, setKits] = useState<Kit[]>([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const fetchDeliveries = async (pageNumber: number, pageSize: number, order: 'default' | 'desc' | 'asc' = sortOrder) => {
    setLoading(true);
    try {
      let data;
      if (order === 'default') {
        data = await getPagedKitDeliveries(pageNumber, pageSize, undefined, searchTerm);
      } else {
        data = await getPagedKitDeliveries(pageNumber, pageSize, order, searchTerm);
      }
      setDeliveriesData(data);
    } catch {
      toast.error('Lấy dữ liệu kit delivery thất bại');
    } finally {
      setLoading(false);
    }
  };

  const fetchKits = async () => {
    try {
      const kitsData = await getAllKits();
      setKits(kitsData);
    } catch (error) {
      console.error('Lỗi khi tải danh sách KIT:', error);
    }
  };

  useEffect(() => {
    fetchKits();
  }, []);

  useEffect(() => {
    if (searchTerm !== '') {
      setDeliveriesData(prev => ({ ...prev, pageNumber: 1 }));
      fetchDeliveries(1, deliveriesData.pageSize, sortOrder);
    } else {
      fetchDeliveries(deliveriesData.pageNumber, deliveriesData.pageSize, sortOrder);
    }
  }, [searchTerm, sortOrder]);

  useEffect(() => {
    if (searchTerm === '') {
      fetchDeliveries(deliveriesData.pageNumber, deliveriesData.pageSize, sortOrder);
    }
  }, [deliveriesData.pageNumber, deliveriesData.pageSize, sortOrder]);

  const handlePreviousPage = () => {
    if (deliveriesData.hasPreviousPage) {
      setDeliveriesData({ ...deliveriesData, pageNumber: deliveriesData.pageNumber - 1 });
    }
  };

  const handleNextPage = () => {
    if (deliveriesData.hasNextPage) {
      setDeliveriesData({ ...deliveriesData, pageNumber: deliveriesData.pageNumber + 1 });
    }
  };

  const getKitName = (kitId: number) => {
    const kit = kits.find(k => k.id === kitId);
    return kit ? kit.name : `Kit ID: ${kitId}`;
  };

  const getStatusInfo = (statusId: string) => {
    return statusMapping[statusId] || { name: 'Không xác định', color: 'bg-gray-100 text-gray-800', icon: <Package size={16} /> };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <Toaster />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
                <Package className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quản Lý Kit Delivery
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quản lý các kit delivery cho xét nghiệm ADN huyết thống
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
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
          </div>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus size={16} />
            Tạo Kit Delivery
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Tìm kiếm theo loại kit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        <div className="overflow-x-auto relative z-0 rounded-xl shadow-lg border border-blue-100 bg-white min-h-[300px]">
          {loading && (
            <div className="text-center py-10 text-blue-600 font-semibold">
              Đang tải dữ liệu...
            </div>
          )}

          {/* Xóa phần hiện lỗi lớn ở giữa bảng, chỉ hiện toast */}

          {!loading && (
            <>
              <table className="min-w-full text-sm text-left relative z-0">
                <thead>
                  <tr className="bg-blue-100 text-blue-700 uppercase text-xs tracking-wider">
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-5">Request ID</th>
                    <th className="py-3 px-5">Kit</th>
                    <th className="py-3 px-5">Loại Kit</th>
                    <th className="py-3 px-5">Trạng thái</th>
                    <th className="py-3 px-5">Ngày tạo</th>
                    <th className="py-3 px-5">Cập nhật lần cuối</th>
                    <th className="py-3 px-5 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveriesData.items.length > 0 ? (
                    deliveriesData.items.map((delivery: KitDelivery) => {
                      const status = getStatusInfo(getStatusId(delivery));
                      return (
                        <tr
                          key={delivery.id}
                          className="border-b hover:bg-blue-50 transition relative"
                        >
                          <td className="py-3 px-5">{delivery.id}</td>
                          <td className="py-3 px-5 font-medium">#{delivery.requestId}</td>
                          <td className="py-3 px-5">{getKitName(delivery.kitId)}</td>
                          <td className="py-3 px-5">{delivery.kitType}</td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon}
                              <span className="ml-1">{status.name}</span>
                            </span>
                          </td>
                          <td className="py-3 px-5">{formatDateTime(delivery.createAt)}</td>
                          <td className="py-3 px-5">{formatDateTime(delivery.updateAt)}</td>
                          <td className="py-3 px-5 text-center relative">
                            <button
                              className="p-2 hover:bg-blue-100 rounded-full"
                              onClick={() =>
                                setOpenMenuId(openMenuId === delivery.id ? null : delivery.id)
                              }
                            >
                              <MoreVertical size={20} />
                            </button>

                            {openMenuId === delivery.id && (
                              <div className="absolute right-5 z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                                {getStatusId(delivery) === 'Pending' && (
                                  <button
                                    onClick={async () => {
                                      try {
                                        await updateKitDeliveryStatus(delivery.id);
                                        toast.success('Đã đánh dấu kit delivery là đã gửi!');
                                        fetchDeliveries(deliveriesData.pageNumber, deliveriesData.pageSize, sortOrder);
                                        setOpenMenuId(null);
                                      } catch {
                                        toast.error('Cập nhật trạng thái thất bại!');
                                      }
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-orange-100 text-sm text-orange-600"
                                  >
                                    <Truck size={16} />
                                    Đánh dấu đã gửi
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedDelivery(delivery);
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
                                    setConfirmDelete({ open: true, delivery });
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-100 text-sm text-red-600 border-t border-gray-100"
                                >
                                  <Trash2 size={16} />
                                  Xóa
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center py-6 text-gray-500">
                        Không có kit delivery nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {deliveriesData.items.length > 0 && (
                <div className="flex justify-between items-center mt-4 px-5 py-3">
                  <div>
                    <p className="text-sm text-gray-600">
                      Trang {deliveriesData.pageNumber} / {deliveriesData.totalPages} (Tổng: {deliveriesData.totalCount} delivery)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!deliveriesData.hasPreviousPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        deliveriesData.hasPreviousPage
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Trang trước
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={!deliveriesData.hasNextPage}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        deliveriesData.hasNextPage
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
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

        {/* Create Modal */}
        <CreateKitDeliveryModal
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => {
            fetchDeliveries(deliveriesData.pageNumber, deliveriesData.pageSize);
            toast.success('Kit delivery đã được tạo thành công!', {
              duration: 3000,
              position: 'bottom-right',
            });
          }}
        />

        {/* Update Modal */}
        {selectedDelivery && (
          <UpdateKitDeliveryModal
            isOpen={isUpdateModalOpen}
            onClose={() => setUpdateModalOpen(false)}
            delivery={{ ...selectedDelivery, statusId: getStatusId(selectedDelivery) }}
            kits={kits}
            onSuccess={() => {
              fetchDeliveries(deliveriesData.pageNumber, deliveriesData.pageSize);
              toast.success(`Kit delivery đã được cập nhật!`, {
                duration: 3000,
                position: 'bottom-right',
              });
            }}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete({ open, delivery: open ? confirmDelete.delivery : null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bạn có chắc chắn muốn xóa kit delivery này?</DialogTitle>
            </DialogHeader>
            <div className="py-2 text-gray-700">
              {confirmDelete.delivery && (
                <span>Bạn sẽ xóa kit delivery: <b>ID {confirmDelete.delivery.id}</b> - {confirmDelete.delivery.kitType}</span>
              )}
            </div>
            <DialogFooter className="mt-4">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setConfirmDelete({ open: false, delivery: null })}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (confirmDelete.delivery) {
                    try {
                      await deleteKitDeliveryById(confirmDelete.delivery.id);
                      toast.success(`Kit delivery đã được xoá thành công!`, {
                        duration: 3000,
                        position: 'bottom-right',
                      });
                      fetchDeliveries(deliveriesData.pageNumber, deliveriesData.pageSize);
                    } catch {
                      toast.error('Xoá kit delivery thất bại!', {
                        duration: 3000,
                        position: 'bottom-right',
                      });
                    }
                  }
                  setConfirmDelete({ open: false, delivery: null });
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

// Update Modal Component
interface UpdateKitDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  delivery: KitDelivery & { statusId: string };
  kits: Kit[];
  onSuccess: () => void;
}

const UpdateKitDeliveryModal: React.FC<UpdateKitDeliveryModalProps> = ({
  isOpen,
  onClose,
  delivery,
  kits,
  onSuccess,
}) => {
  const [selectedKitId, setSelectedKitId] = useState<string>(delivery.kitId.toString());
  const [kitType, setKitType] = useState<string>(delivery.kitType);
  const currentStatus = delivery.statusId;
  // Nếu đã là Sent thì chỉ cho phép giữ nguyên Sent, không cho chọn Pending nữa
  const [status, setStatus] = useState<string>(currentStatus === 'Pending' || currentStatus === 'Sent' ? currentStatus : 'Sent');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedKitId || !kitType.trim() || !status) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      // Import updateKitDelivery function
      const { updateKitDelivery } = await import('../api/kitDelivery.api');
      await updateKitDelivery(delivery.id, {
        kitId: parseInt(selectedKitId),
        kitType: kitType.trim(),
        status,
      });

      toast.success('Cập nhật kit delivery thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Lỗi khi cập nhật kit delivery:', error);
      toast.error('Cập nhật kit delivery thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedKitId(delivery.kitId.toString());
    setKitType(delivery.kitType);
    setStatus(delivery.statusId === 'Pending' || delivery.statusId === 'Sent' ? delivery.statusId : 'Sent');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-700">
            Cập nhật Kit Delivery
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kitId" className="text-sm font-medium text-gray-700">
              Chọn KIT *
            </Label>
            <Select value={selectedKitId} onValueChange={setSelectedKitId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn KIT" />
              </SelectTrigger>
              <SelectContent>
                {kits.map((kit) => (
                  <SelectItem key={kit.id} value={kit.id.toString()}>
                    {kit.name} - {kit.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="kitType" className="text-sm font-medium text-gray-700">
              Loại Kit *
            </Label>
            <Input
              id="kitType"
              value={kitType}
              onChange={(e) => setKitType(e.target.value)}
              placeholder="Nhập loại kit"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Trạng thái *
            </Label>
            <Select value={status} onValueChange={setStatus} disabled={currentStatus === 'Sent'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {currentStatus === 'Pending' && <SelectItem value="Pending">Chờ xử lý</SelectItem>}
                <SelectItem value="Sent">Đã gửi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedKitId || !kitType.trim() || !status}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KitDeliveryManagement; 