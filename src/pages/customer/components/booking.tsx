// src/pages/BookingPage.tsx
import { useState, useEffect } from "react";
import {
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

export const BookingPage: React.FC = () => {
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
    const token = localStorage.getItem("accessToken");
    if (token) {
      const payload = parseJwt(token);
      const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      if (userId) {
        getUserById(Number(userId)).then(setUserData).catch(() => setUserData(null));
      }
    }
  }, []);

  // Lấy danh sách sample methods
  useEffect(() => {
    getAllSampleMethods().then(setSampleMethods).catch(() => setSampleMethods([]));
  }, []);

  // Lấy danh sách services
  useEffect(() => {
    getAllService().then(setServices).catch(() => setServices([]));
  }, []);

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

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto mt-8 mb-8 w-full">
        <Card className="w-full bg-white shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-t-lg">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-4xl font-bold mb-2">Đăng Ký Xét Nghiệm</h2>
              <p className="text-white/90 text-lg">Chọn dịch vụ, phương pháp lấy mẫu và thời gian phù hợp</p>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            {userData && (
              <div className="w-full flex flex-col items-center justify-center py-3 mb-4">
                <div className="text-2xl font-bold text-blue-900 mb-2">Thông tin khách hàng</div>
                <div className="w-full flex flex-col space-y-2 text-base text-gray-800 bg-gray-50 rounded-lg p-4 shadow-sm items-center">
                  <div><span className="font-medium">Họ tên:</span> {userData.name}</div>
                  <div><span className="font-medium">Email:</span> {userData.email}</div>
                  <div><span className="font-medium">Số điện thoại:</span> {userData.phone}</div>
                  <div><span className="font-medium">Địa chỉ:</span> {userData.address || <span className="italic text-gray-400">Chưa cập nhật</span>}</div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <div className="space-y-6">
                  <Label className="text-lg text-blue-900 font-semibold">Dịch vụ xét nghiệm</Label>
                  <Select
                    value={formData.serviceId?.toString() || ""}
                    onValueChange={(val) => handleInputChange("serviceId", Number(val))}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()} className="text-lg">
                          {service.name} - {service.price?.toLocaleString()}đ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceId && <div className="text-red-500 text-base">{errors.serviceId}</div>}
                </div>
                <div className="space-y-6">
                  <Label className="text-lg text-blue-900 font-semibold">Phương pháp lấy mẫu</Label>
                  <Select
                    value={formData.sampleMethodId?.toString() || ""}
                    onValueChange={(val) => handleInputChange("sampleMethodId", Number(val))}
                  >
                    <SelectTrigger className="h-14 text-lg">
                      <SelectValue placeholder="Chọn phương pháp lấy mẫu" />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id.toString()} className="text-lg">
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sampleMethodId && <div className="text-red-500 text-base">{errors.sampleMethodId}</div>}
                </div>
                <div className="flex gap-8">
                  <div className="flex-1">
                    <Label className="text-lg text-blue-900 font-semibold">Ngày hẹn</Label>
                    <Input
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                      className="h-12 text-lg"
                    />
                    {errors.appointmentDate && <div className="text-red-500 text-base">{errors.appointmentDate}</div>}
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg text-blue-900 font-semibold">Giờ hẹn</Label>
                    <Input
                      type="time"
                      value={formData.appointmentTime}
                      onChange={(e) => handleInputChange("appointmentTime", e.target.value)}
                      className="h-12 text-lg"
                    />
                    {errors.appointmentTime && <div className="text-red-500 text-base">{errors.appointmentTime}</div>}
                  </div>
                </div>
                <div>
                  <Label className="text-lg text-blue-900 font-semibold">Ghi chú (tuỳ chọn)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Ghi chú cho nhân viên nếu có..."
                    className="text-lg min-h-[56px]"
                  />
                </div>
                {errors.submit && <div className="text-red-500 text-base">{errors.submit}</div>}
                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={loading} className="h-14 px-10 text-lg">
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </div>
              </>
            )}
            {step === 2 && success && (
              <div className="flex flex-col items-center justify-center space-y-6 py-16">
                <CheckCircleIcon className="text-green-500 w-20 h-20" />
                <div className="text-2xl font-semibold">Đăng ký thành công!</div>
                <Button onClick={resetForm} className="h-12 px-8 text-lg">Đăng ký lại</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};