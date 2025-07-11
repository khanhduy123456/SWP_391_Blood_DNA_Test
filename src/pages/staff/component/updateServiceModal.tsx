'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import toast from 'react-hot-toast';
import { updateService } from '../api/service.api'; // đường dẫn tuỳ bạn
import type { UpdateServicePayload } from '../api/service.api';

interface UpdateServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: number;
  initialName: string;
  initialDescription: string;
  initialType: string;
  initialPrice: number;
  initialSampleMethodIds: number[];
  onSuccess?: () => void;
}

export const UpdateServiceModal: React.FC<UpdateServiceModalProps> = ({
  isOpen,
  onClose,
  serviceId,
  initialName,
  initialDescription,
  initialType,
  initialPrice,
  initialSampleMethodIds,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<UpdateServicePayload>({
    name: initialName,
    description: initialDescription,
    type: initialType,
    price: initialPrice,
    sampleMethodIds: initialSampleMethodIds,
  });
  const [loading, setLoading] = useState(false);

  // Reset form mỗi khi mở lại
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialName,
        description: initialDescription,
        type: initialType,
        price: initialPrice,
        sampleMethodIds: initialSampleMethodIds,
      });
    }
  }, [isOpen, initialName, initialDescription, initialType, initialPrice, initialSampleMethodIds]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof UpdateServicePayload, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateService(serviceId, formData);
      toast.success('Service đã được cập nhật thành công!', {
        duration: 3000,
        position: 'bottom-right',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Cập nhật Service thất bại:', error);
      toast.error('Có lỗi xảy ra khi cập nhật Service', {
        duration: 3000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-700">
            Cập nhật dịch vụ
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tên dịch vụ *</label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Nhập tên dịch vụ"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mô tả *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Nhập mô tả dịch vụ"
              className="w-full"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Loại dịch vụ *</label>
            <Input
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              placeholder="Nhập loại dịch vụ"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Giá (VNĐ) *</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', Number(e.target.value))}
              placeholder="Nhập giá dịch vụ"
              className="w-full"
              min="0"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">ID phương pháp lấy mẫu</label>
            <Input
              value={formData.sampleMethodIds.join(',')}
              onChange={(e) =>
                handleChange(
                  'sampleMethodIds',
                  e.target.value
                    .split(',')
                    .map((id) => parseInt(id.trim()))
                    .filter((id) => !isNaN(id))
                )
              }
              placeholder="Nhập ID phương pháp lấy mẫu (cách nhau bằng dấu phẩy)"
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="px-6"
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="px-6 bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
