import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { getAllKits } from '@/features/admin/api/kit.api';
import { createKitDelivery, getExRequestById } from '../api/kitDelivery.api';
import type { Kit } from '@/features/admin/types/kit';
import toast from 'react-hot-toast';

interface CreateKitDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateKitDeliveryModal: React.FC<CreateKitDeliveryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [kits, setKits] = useState<Kit[]>([]);
  const [selectedKitId, setSelectedKitId] = useState<string>('');
  const [kitType, setKitType] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [checkingRequest, setCheckingRequest] = useState(false);
  const [requestValid, setRequestValid] = useState(false);
  const [requestError, setRequestError] = useState<string>('');

  // Fetch kits khi modal mở
  useEffect(() => {
    if (isOpen) {
      fetchKits();
      setRequestId('');
      setRequestValid(false);
      setRequestError('');
      setSelectedKitId('');
      setKitType('');
    }
  }, [isOpen]);

  const fetchKits = async () => {
    try {
      setKitsLoading(true);
      const kitsData = await getAllKits();
      setKits(kitsData);
    } catch (error) {
      console.error('Lỗi khi tải danh sách KIT:', error);
      toast.error('Không thể tải danh sách KIT');
    } finally {
      setKitsLoading(false);
    }
  };

  // Kiểm tra requestId hợp lệ và sampleMethodId === 2
  const handleCheckRequest = async () => {
    setCheckingRequest(true);
    setRequestError('');
    setRequestValid(false);
    try {
      const reqIdNum = parseInt(requestId);
      if (isNaN(reqIdNum)) {
        setRequestError('Request ID phải là số');
        setCheckingRequest(false);
        return;
      }
      const exRequest = await getExRequestById(reqIdNum);
      if (exRequest.sampleMethodId !== 2) {
        setRequestError('Chỉ được tạo kit delivery cho đơn hàng có phương pháp lấy mẫu là "Tự thu mẫu tại Nhà Riêng - Dân Sự" (sampleMethodId = 2)');
        setRequestValid(false);
      } else {
        setRequestValid(true);
        setRequestError('');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setRequestError('Không tìm thấy đơn hàng hoặc lỗi server');
      setRequestValid(false);
    } finally {
      setCheckingRequest(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestValid) {
      toast.error('Vui lòng nhập requestId hợp lệ trước khi tạo');
      return;
    }
    if (!selectedKitId || !kitType.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setLoading(true);
      await createKitDelivery({
        requestId: parseInt(requestId),
        kitId: parseInt(selectedKitId),
        kitType: kitType.trim(),
      });

      toast.success('Tạo kit delivery thành công!');
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Lỗi khi tạo kit delivery:', error);
      toast.error('Tạo kit delivery thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedKitId('');
    setKitType('');
    setRequestId('');
    setRequestValid(false);
    setRequestError('');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-700">
            Tạo Kit Delivery
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requestId" className="text-sm font-medium text-gray-700">
              Request ID *
            </Label>
            <div className="flex gap-2 items-center">
              <Input
                id="requestId"
                value={requestId}
                onChange={e => setRequestId(e.target.value)}
                placeholder="Nhập requestId"
                className="w-full"
                disabled={loading}
              />
              <Button type="button" onClick={handleCheckRequest} disabled={checkingRequest || !requestId || loading} className="bg-blue-600 text-white">
                {checkingRequest ? 'Đang kiểm tra...' : 'Kiểm tra'}
              </Button>
            </div>
            {requestError && <div className="text-red-600 text-sm mt-1">{requestError}</div>}
            {requestValid && <div className="text-green-600 text-sm mt-1">Request hợp lệ! Có thể tạo kit delivery.</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kitId" className="text-sm font-medium text-gray-700">
              Chọn KIT *
            </Label>
            <Select value={selectedKitId} onValueChange={setSelectedKitId} disabled={!requestValid}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn KIT để sử dụng" />
              </SelectTrigger>
              <SelectContent>
                {kitsLoading ? (
                  <SelectItem value="" disabled>
                    Đang tải danh sách KIT...
                  </SelectItem>
                ) : kits.length > 0 ? (
                  kits.map((kit) => (
                    <SelectItem key={kit.id} value={kit.id.toString()}>
                      {kit.name} - {kit.description}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Không có KIT nào
                  </SelectItem>
                )}
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
              placeholder="Nhập loại kit (ví dụ: ADN Cha-Con, ADN Mẹ-Con...)"
              className="w-full"
              disabled={!requestValid}
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
              disabled={loading || !selectedKitId || !kitType.trim() || !requestValid}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Đang tạo...' : 'Tạo Kit Delivery'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 