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
import { updateSampleMethod } from '../api/sample.api';

interface UpdateSampleMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  sampleMethodId: number;
  initialName: string;
  initialDescription: string;
  onSuccess?: () => void;
}

export const UpdateSampleMethodModal: React.FC<UpdateSampleMethodModalProps> = ({
  isOpen,
  onClose,
  sampleMethodId,
  initialName,
  initialDescription,
  onSuccess,
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateSampleMethod(sampleMethodId, { name, description });
      toast.success('Sample Method đã được cập nhật thành công!', {
        duration: 3000,
        position: 'bottom-right',
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Cập nhật thất bại:', error);
      toast.error('Có lỗi xảy ra khi cập nhật Sample Method', {
        duration: 3000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật Sample Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên Sample Method"
            required
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Huỷ
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
