import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";

interface ViewDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: {
    id: number;
    userName: string;
    serviceName: string;
    sampleMethodName: string;
    statusName: string;
    appointmentTime: string;
    staffName: string;
    staffId: number; // Thêm staffId
  };
}

const ViewDetail: React.FC<ViewDetailProps> = ({ open, onOpenChange, request }) => {
  // Định dạng ngày giờ cho dễ đọc
  const formattedAppointmentTime = new Date(request.appointmentTime).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            ID {request.id} - {request.userName}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-2">
              <p><strong>Loại dịch vụ:</strong> {request.serviceName}</p>
              <p><strong>Phương thức lấy mẫu:</strong> {request.sampleMethodName}</p>
              <p><strong>Trạng thái:</strong> {request.statusName}</p>
              <p><strong>Lịch hẹn:</strong> {formattedAppointmentTime}</p>
              <p>
                <strong>Phân công cho nhân viên:</strong>{" "}
                {request.staffId !== 0 ? request.staffName : "Chưa có"}
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ViewDetail;