import { useState, useEffect } from "react";
import {
  X,
  CheckCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { Input } from "@/shared/ui/input";
import { getUserById } from "@/features/admin/api/user.api";
import { getAllSampleMethods } from "@/features/admin/api/sample.api";
import { getAllService } from "@/pages/staff/api/service.api";
import { createExRequest, type CreateExRequest } from "../api/exRequest.api";

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

interface UserData {
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface BookingData {
  serviceId: number | null;
  sampleMethodId: number | null;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

interface SampleMethod {
  id: number;
  name: string;
  description?: string;
}
interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number; // Thêm userId vào props
  onSubmit?: (bookingData: BookingData) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [sampleMethods, setSampleMethods] = useState<SampleMethod[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<BookingData>({
    serviceId: null,
    sampleMethodId: null,
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Lấy userId từ token và fetch profile
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const payload = parseJwt(token);
        const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (userId) {
          getUserById(Number(userId)).then(setUserData).catch(() => setUserData(null));
        }
      }
    }
  }, [isOpen]);

  // Lấy danh sách sample methods
  useEffect(() => {
    if (isOpen) {
      getAllSampleMethods().then(setSampleMethods).catch(() => setSampleMethods([]));
    }
  }, [isOpen]);

  // Lấy danh sách services
  useEffect(() => {
    if (isOpen) {
      getAllService().then(setServices).catch(() => setServices([]));
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.serviceId) newErrors.serviceId = "Vui lòng chọn dịch vụ";
    if (!formData.sampleMethodId) newErrors.sampleMethodId = "Vui lòng chọn phương pháp lấy mẫu";
    if (!formData.appointmentDate) newErrors.appointmentDate = "Vui lòng chọn ngày";
    if (!formData.appointmentTime) newErrors.appointmentTime = "Vui lòng chọn giờ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !userData) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const payload = token ? parseJwt(token) : null;
      const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      if (!userId) throw new Error("Không tìm thấy userId");
      const appointmentTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}:00.000Z`).toISOString();
      const req: CreateExRequest = {
        userId: Number(userId),
        serviceId: Number(formData.serviceId),
        priorityId: 1, // Có thể cho user chọn nếu cần
        sampleMethodId: Number(formData.sampleMethodId),
        appointmentTime,
      };
      await createExRequest(req);
      setSuccess(true);
      setStep(2);
    } catch {
      setErrors({ submit: "Đã có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceId: null,
      sampleMethodId: null,
      appointmentDate: "",
      appointmentTime: "",
      notes: "",
    });
    setStep(1);
    setErrors({});
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl border-0">
        <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Đặt Lịch Xét Nghiệm</h2>
              <p className="text-white/90">Chọn dịch vụ, phương pháp lấy mẫu và thời gian phù hợp</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full"
              aria-label="Đóng modal"
            >
              <X />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {userData && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="font-semibold text-blue-900 mb-2">Thông tin khách hàng</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Họ tên:</span> {userData.name}</div>
                <div><span className="font-medium">Email:</span> {userData.email}</div>
                <div><span className="font-medium">Số điện thoại:</span> {userData.phone}</div>
                <div><span className="font-medium">Địa chỉ:</span> {userData.address || <span className="italic text-gray-400">Chưa cập nhật</span>}</div>
              </div>
            </div>
          )}
          {step === 1 && (
            <>
              <div className="space-y-4">
                <Label>Dịch vụ xét nghiệm</Label>
                <Select
                  value={formData.serviceId?.toString() || ""}
                  onValueChange={(val) => handleInputChange("serviceId", Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        {service.name} - {service.price?.toLocaleString()}đ
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.serviceId && <div className="text-red-500 text-sm">{errors.serviceId}</div>}
              </div>
              <div className="space-y-4">
                <Label>Phương pháp lấy mẫu</Label>
                <Select
                  value={formData.sampleMethodId?.toString() || ""}
                  onValueChange={(val) => handleInputChange("sampleMethodId", Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương pháp lấy mẫu" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sampleMethodId && <div className="text-red-500 text-sm">{errors.sampleMethodId}</div>}
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Ngày hẹn</Label>
                  <Input
                    type="date"
                    value={formData.appointmentDate}
                    onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                  />
                  {errors.appointmentDate && <div className="text-red-500 text-sm">{errors.appointmentDate}</div>}
                </div>
                <div className="flex-1">
                  <Label>Giờ hẹn</Label>
                  <Input
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) => handleInputChange("appointmentTime", e.target.value)}
                  />
                  {errors.appointmentTime && <div className="text-red-500 text-sm">{errors.appointmentTime}</div>}
                </div>
              </div>
              <div>
                <Label>Ghi chú (tuỳ chọn)</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Ghi chú cho nhân viên nếu có..."
                />
              </div>
              {errors.submit && <div className="text-red-500 text-sm">{errors.submit}</div>}
              <div className="flex justify-end">
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Đang đặt lịch..." : "Đặt lịch"}
                </Button>
              </div>
            </>
          )}
          {step === 2 && success && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <CheckCircleIcon className="text-green-500 w-16 h-16" />
              <div className="text-xl font-semibold">Đặt lịch thành công!</div>
              <Button onClick={handleClose}>Đóng</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};