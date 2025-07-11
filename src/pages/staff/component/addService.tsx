'use client';

import React, { useState } from 'react';
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
import { createService, type CreateServicePayload } from '../api/service.api';
import type { Service } from '../type/service';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceCreated: (service: Service) => void;
}

export const AddServiceModal: React.FC<AddServiceModalProps> = ({
  isOpen,
  onClose,
  onServiceCreated,
}) => {
  const [formData, setFormData] = useState<CreateServicePayload>({
    name: '',
    description: '',
    type: '',
    price: 0,
    sampleMethodIds: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateServicePayload, value: string | number | number[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.type.trim() || formData.price <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin!', {
        duration: 3000,
        position: 'bottom-right',
      });
      return;
    }

    setLoading(true);
    try {
      const newService = await createService(formData);
      toast.success(`"${newService.name}" đã được tạo thành công!`, {
        duration: 3000,
        position: 'bottom-right',
      });
      onServiceCreated(newService);
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: '',
        price: 0,
        sampleMethodIds: [],
      });
    } catch (error) {
      console.error('Tạo Service thất bại:', error);
      toast.error('Có lỗi xảy ra khi tạo Service', {
        duration: 3000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form khi đóng
      setFormData({
        name: '',
        description: '',
        type: '',
        price: 0,
        sampleMethodIds: [],
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-green-700">
            Thêm dịch vụ mới
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
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
            onClick={handleClose}
            disabled={loading}
            className="px-6"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Đang tạo...' : 'Tạo dịch vụ'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
