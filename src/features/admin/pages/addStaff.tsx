'use client';

import { useState } from 'react'; 
import toast from 'react-hot-toast';
import { registerAdmin } from '../api/user.api';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

interface AddUserDialogProps {
  onSuccess?: () => void;
}

export function AddUserDialog({ onSuccess }: AddUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(3); // 3 = Staff, 4 = Manager
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    setLoading(true);
    try {
      await registerAdmin({ email, password, roleId });
      toast.success('Tạo tài khoản thành công!');
      setEmail('');
      setPassword('');
      setRoleId(3);
      setOpen(false);
      onSuccess?.();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      let errorMessage = 'Tạo tài khoản thất bại!';
      interface ErrorWithResponse {
        response: {
          data?: { message?: string };
          status?: number;
        };
      }
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        const response = (error as ErrorWithResponse).response;
        if (
          response.data?.message &&
          typeof response.data.message === 'string' &&
          response.data.message.toLowerCase().includes('email')
        ) {
          errorMessage = 'Email đã tồn tại!';
        } else if (response.status === 400 || response.status === 409) {
          errorMessage = 'Email đã tồn tại!';
        }
      }
      toast.error(errorMessage);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ Thêm người dùng</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm tài khoản mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Mật khẩu"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2 text-sm"
          >
            <option value={3}>Nhân viên (Staff)</option>
            <option value={4}>Quản lý (Manager)</option>
          </select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button onClick={handleAddUser} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
