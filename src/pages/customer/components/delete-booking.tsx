import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import { deleteExRequest } from "../api/exRequest.api";
import type { ExRequestResponse } from "../types/exRequestPaged";
import { Trash2Icon, AlertTriangleIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteBookingProps {
  isOpen: boolean;
  onClose: () => void;
  booking: ExRequestResponse | null;
  onDeleteSuccess: () => void;
}

export default function DeleteBooking({ isOpen, onClose, booking, onDeleteSuccess }: DeleteBookingProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!booking) return;
    
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do xóa!", {
        position: "bottom-right",
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    try {
      await deleteExRequest(booking.id);
      
      toast.success("Đã xóa đăng ký xét nghiệm thành công!", {
        position: "bottom-right",
        duration: 4000,
      });
      
      onDeleteSuccess();
      onClose();
      setReason("");
    } catch (error) {
      console.error("Lỗi khi xóa booking:", error);
      toast.error("Có lỗi xảy ra khi xóa đăng ký!", {
        position: "bottom-right",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-red-50 to-white border border-red-200 shadow-2xl">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={handleClose}
          >
            <XIcon size={20} />
          </Button>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold text-red-900">
            <div className="bg-red-100 rounded-full p-2">
              <AlertTriangleIcon className="text-red-700" size={24} />
            </div>
            Xác nhận xóa đăng ký
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin booking */}
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Thông tin đăng ký sẽ bị xóa:</h3>
            <div className="text-sm text-red-800 space-y-1">
              <p><span className="font-medium">ID:</span> #{booking.id}</p>
              <p><span className="font-medium">Dịch vụ:</span> #{booking.serviceId}</p>
              <p><span className="font-medium">Thời gian hẹn:</span> {new Date(booking.appointmentTime).toLocaleString("vi-VN")}</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Hành động này không thể hoàn tác. Đăng ký sẽ bị xóa vĩnh viễn.
            </p>
          </div>

          {/* Lý do xóa */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-semibold text-gray-700">
              Lý do xóa <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do bạn muốn xóa đăng ký này..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white border-red-300 focus:border-red-500 focus:ring-red-500 min-h-[100px]"
              required
            />
            <p className="text-xs text-gray-500">
              Vui lòng cung cấp lý do để chúng tôi có thể cải thiện dịch vụ
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold"
              disabled={loading || !reason.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xóa...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2Icon size={16} />
                  Xóa đăng ký
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 