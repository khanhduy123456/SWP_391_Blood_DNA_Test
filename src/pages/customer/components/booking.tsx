// src/pages/BookingPage.tsx
import { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  UserCircle2Icon,
  FlaskConicalIcon,
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
  type: string;
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

  // Helper: tạo danh sách các mốc giờ 30 phút từ 07:00 đến 17:00
  const timeOptions: string[] = [];
  for (let h = 7; h <= 17; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const min = m.toString().padStart(2, '0');
      timeOptions.push(`${hour}:${min}`);
    }
  }

  // Helper: kiểm tra ngày có phải quá khứ không
  const isPastDate = (dateStr: string) => {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const picked = new Date(dateStr);
    picked.setHours(0,0,0,0);
    return picked < today;
  };

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
    if (formData.appointmentDate && isPastDate(formData.appointmentDate)) newErrors.appointmentDate = "Không được chọn ngày trong quá khứ";
    if (!formData.appointmentTime) newErrors.appointmentTime = "Vui lòng chọn giờ";
    // Kiểm tra giờ hợp lệ
    if (formData.appointmentTime && !timeOptions.includes(formData.appointmentTime)) newErrors.appointmentTime = "Giờ không hợp lệ";
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex flex-col py-8 px-2 md:px-0">
      <div className="max-w-3xl mx-auto w-full">
        <Card className="w-full bg-white/90 shadow-2xl border border-blue-100 rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-8 rounded-t-2xl flex flex-col items-center justify-center gap-2">
            <FlaskConicalIcon className="w-12 h-12 text-white mb-2" />
            <h2 className="text-4xl font-extrabold mb-1 tracking-tight">Đăng ký xét nghiệm ADN</h2>
            <p className="text-white/90 text-lg">Chọn dịch vụ, phương pháp lấy mẫu và thời gian phù hợp</p>
          </CardHeader>
          <CardContent className="p-8 md:p-10 space-y-10">
            {userData && (
              <div className="w-full flex flex-col items-center justify-center py-2 mb-2">
                <div className="text-2xl font-bold text-blue-900 mb-1 flex items-center gap-2">
                  <UserCircle2Icon className="w-8 h-8 text-blue-700" />
                  Thông tin khách hàng
                </div>
                <div className="w-full flex flex-row flex-wrap gap-4 text-base text-gray-800 bg-blue-50 rounded-lg p-4 shadow-sm items-center justify-between">
                  <div className="flex-1 min-w-[180px]"><span className="font-medium">Họ tên:</span> {userData.name}</div>
                  <div className="flex-1 min-w-[180px]"><span className="font-medium">Email:</span> {userData.email}</div>
                  <div className="flex-1 min-w-[180px]"><span className="font-medium">Số điện thoại:</span> {userData.phone}</div>
                  <div className="flex-1 min-w-[180px]"><span className="font-medium">Địa chỉ:</span> {userData.address || <span className="italic text-gray-400">Chưa cập nhật</span>}</div>
                </div>
              </div>
            )}
            {step === 1 && (
              <>
                <div className="space-y-6">
                  <Label className="text-lg text-blue-900 font-semibold">Dịch vụ xét nghiệm <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.serviceId?.toString() || ""}
                    onValueChange={(val) => handleInputChange("serviceId", Number(val))}
                  >
                    <SelectTrigger className="h-14 text-lg border-blue-300 focus:ring-2 focus:ring-blue-400">
                      <SelectValue placeholder="Chọn dịch vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()} className="text-lg">
                          {service.name} - {service.type} - {service.price?.toLocaleString()}đ
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.serviceId && <div className="text-red-500 text-base">{errors.serviceId}</div>}
                </div>
                <div className="space-y-6">
                  <Label className="text-lg text-blue-900 font-semibold">Phương pháp lấy mẫu <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.sampleMethodId?.toString() || ""}
                    onValueChange={(val) => handleInputChange("sampleMethodId", Number(val))}
                  >
                    <SelectTrigger className="h-14 text-lg border-blue-300 focus:ring-2 focus:ring-blue-400">
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
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <Label className="text-lg text-blue-900 font-semibold">Ngày hẹn <span className="text-red-500">*</span></Label>
                    <Input
                      type="date"
                      value={formData.appointmentDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                      className="h-12 text-lg border-blue-300 focus:ring-2 focus:ring-blue-400"
                    />
                    {errors.appointmentDate && <div className="text-red-500 text-base">{errors.appointmentDate}</div>}
                  </div>
                  <div className="flex-1">
                    <Label className="text-lg text-blue-900 font-semibold">Giờ hẹn <span className="text-red-500">*</span></Label>
                    <select
                      value={formData.appointmentTime}
                      onChange={e => handleInputChange("appointmentTime", e.target.value)}
                      className="h-12 text-lg border border-blue-300 rounded-md w-full focus:ring-2 focus:ring-blue-400 px-3"
                    >
                      <option value="">Chọn giờ</option>
                      {timeOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.appointmentTime && <div className="text-red-500 text-base">{errors.appointmentTime}</div>}
                  </div>
                </div>
                <div>
                  <Label className="text-lg text-blue-900 font-semibold">Ghi chú (tuỳ chọn)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Ghi chú cho nhân viên nếu có..."
                    className="text-lg min-h-[56px] border-blue-300 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                {errors.submit && <div className="text-red-500 text-base">{errors.submit}</div>}
                <div className="flex justify-end">
                  <Button onClick={handleSubmit} disabled={loading} className="h-14 px-10 text-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md">
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </div>
              </>
            )}
            {step === 2 && success && (
              <div className="flex flex-col items-center justify-center space-y-6 py-16">
                <CheckCircleIcon className="text-green-500 w-20 h-20" />
                <div className="text-2xl font-semibold text-blue-900">Đăng ký thành công!</div>
                <div className="text-base text-gray-700 text-center max-w-md">
                  Cảm ơn bạn đã đăng ký dịch vụ xét nghiệm ADN.<br/>
                  Vui lòng kiểm tra lại thông tin đặt lịch trong email đã đăng ký hoặc trên điện thoại của bạn. Nếu có thắc mắc, hãy liên hệ với chúng tôi để được hỗ trợ.
                </div>
                <Button onClick={resetForm} className="h-12 px-8 text-lg bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md">Đăng ký lại</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};