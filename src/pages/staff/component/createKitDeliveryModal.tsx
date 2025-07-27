import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { createKitDelivery, getExRequestsByStaffId, type ExRequest } from '../api/delivery.api';
import { getAllKits } from '@/features/admin/api/kit.api';
import type { Kit } from '@/features/admin/types/kit';
import { getStaffIdByUserId } from '../api/staff.api';
import toast from 'react-hot-toast';

interface CreateKitDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  requestId?: number; // Thêm prop requestId
}

// Hàm parseJwt để lấy userId từ accessToken
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const CreateKitDeliveryModal: React.FC<CreateKitDeliveryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  requestId,
}) => {
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [selectedKitId, setSelectedKitId] = useState<string>('');
  const [kitType, setKitType] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ExRequest[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [staffId, setStaffId] = useState<number | null>(null);

  // Lấy staffId từ userId
  useEffect(() => {
    const fetchStaffId = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          toast.error('Không tìm thấy access token');
          return;
        }

        const payload = parseJwt(token);
        const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (!userId) {
          toast.error('Không thể lấy userId từ token');
          return;
        }

        const staffData = await getStaffIdByUserId(parseInt(userId));
        setStaffId(staffData.staffId);
      } catch (error) {
        console.error('Lỗi khi lấy staffId:', error);
        toast.error('Không thể lấy thông tin staff');
      }
    };

    if (isOpen) {
      fetchStaffId();
    }
  }, [isOpen]);

  // Tự động set requestId khi modal mở và có requestId được truyền vào
  useEffect(() => {
    if (isOpen && requestId) {
      setSelectedRequestId(requestId.toString());
    }
  }, [isOpen, requestId]);

  // Lấy danh sách requests theo staffId và lọc theo methodId = 2
  useEffect(() => {
    const fetchRequests = async () => {
      if (!staffId) return;

      try {
        const requestsData = await getExRequestsByStaffId(staffId);
        // Lọc chỉ những request có sampleMethodId = 2 (Tự thu mẫu tại Nhà Riêng - Dân Sự)
        const filteredRequests = requestsData.filter(request => request.sampleMethodId === 2);
        setRequests(filteredRequests);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách requests:', error);
        toast.error('Không thể lấy danh sách yêu cầu');
      }
    };

    if (staffId) {
      fetchRequests();
    }
  }, [staffId]);

  // Lấy danh sách kits
  useEffect(() => {
    const fetchKits = async () => {
      try {
        const kitsData = await getAllKits();
        setKits(kitsData);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách kits:', error);
        toast.error('Không thể lấy danh sách kits');
      }
    };

    if (isOpen) {
      fetchKits();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalRequestId = requestId || selectedRequestId;
    
    if (!finalRequestId || !selectedKitId || !kitType.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      // Tạo kit delivery
      console.log('Creating kit delivery with data:', {
        requestId: typeof finalRequestId === 'string' ? parseInt(finalRequestId) : finalRequestId,
        kitId: parseInt(selectedKitId),
        kitType: kitType.trim(),
      });
      
      const created = await createKitDelivery({
        requestId: typeof finalRequestId === 'string' ? parseInt(finalRequestId) : finalRequestId,
        kitId: parseInt(selectedKitId),
        kitType: kitType.trim(),
      });
      
      console.log('Kit delivery created successfully:', created);

      toast.success('Tạo kit delivery thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Lỗi khi tạo kit delivery:', error);
      
      // Hiển thị thông tin lỗi chi tiết hơn
      if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          toast.error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
        } else if (errorMessage.includes('404')) {
          toast.error('API không tồn tại. Vui lòng liên hệ admin.');
        } else if (errorMessage.includes('500')) {
          toast.error('Lỗi server. Vui lòng thử lại sau.');
        } else if (errorMessage.includes('400')) {
          toast.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
        } else {
          toast.error(`Tạo kit delivery thất bại: ${errorMessage}`);
        }
      } else {
        toast.error('Tạo kit delivery thất bại');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedRequestId('');
    setSelectedKitId('');
    setKitType('');
    setLoading(false);
    onClose();
  };

  const getRequestDisplayName = (request: ExRequest) => {
    return `ID: ${request.id} - ${request.userName} - ${request.serviceName}`;
  };

  const getKitDisplayName = (kit: Kit) => {
    return `${kit.name} - ${kit.description}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-700">
            Tạo Kit Delivery Mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestId" className="text-sm font-medium text-gray-700">
              Yêu Cầu (Tự thu mẫu) *
            </Label>
            {requestId ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <span className="text-sm text-gray-700">
                  Request ID: {requestId} (Đã được chọn tự động)
                </span>
              </div>
            ) : (
              <>
                <Select value={selectedRequestId} onValueChange={setSelectedRequestId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn yêu cầu" />
                  </SelectTrigger>
                  <SelectContent>
                    {requests.map((request) => (
                      <SelectItem key={request.id} value={request.id.toString()}>
                        {getRequestDisplayName(request)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {requests.length === 0 && (
                  <p className="text-sm text-orange-600 mt-1">
                    Không có yêu cầu nào phù hợp (chỉ hiển thị các yêu cầu có phương thức "Tự thu mẫu tại Nhà Riêng - Dân Sự")
                  </p>
                )}
              </>
            )}
          </div>

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
                    {getKitDisplayName(kit)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {kits.length === 0 && (
              <p className="text-sm text-orange-600 mt-1">
                Không có KIT nào khả dụng
              </p>
            )}
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
              disabled={loading || (!requestId && !selectedRequestId) || !selectedKitId || !kitType.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Đang tạo...' : 'Tạo Kit Delivery'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 