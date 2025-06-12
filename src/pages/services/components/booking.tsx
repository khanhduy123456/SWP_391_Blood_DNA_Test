import { useState } from "react";
import {
  X,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
  HomeIcon,
  BuildingIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { RadioGroup } from "@radix-ui/react-dropdown-menu";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

interface BookingData {
  serviceType: "home" | "clinic";
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  testType: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (bookingData: BookingData) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<BookingData>({
    serviceType: "home",
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
    testType: "general",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({});

  const testTypes = [
    { id: "general", name: "Xét nghiệm tổng quát", price: "500.000đ" },
    { id: "covid", name: "Test COVID-19", price: "300.000đ" },
    { id: "blood", name: "Xét nghiệm máu", price: "400.000đ" },
    { id: "urine", name: "Xét nghiệm nước tiểu", price: "200.000đ" },
    { id: "genetic", name: "Xét nghiệm gen", price: "2.000.000đ" },
  ];

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {};
    if (!formData.testType) newErrors.testType = "Vui lòng chọn loại xét nghiệm";
    if (!formData.serviceType) newErrors.serviceType = "Vui lòng chọn hình thức thu mẫu";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<Record<keyof BookingData, string>> = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (formData.serviceType === "home" && !formData.address)
      newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.preferredDate) newErrors.preferredDate = "Vui lòng chọn ngày";
    if (!formData.preferredTime) newErrors.preferredTime = "Vui lòng chọn thời gian";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onSubmit?.(formData);
      setStep(3);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setErrors({ notes: "Đã có lỗi xảy ra, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceType: "home",
      name: "",
      email: "",
      phone: "",
      address: "",
      preferredDate: "",
      preferredTime: "",
      notes: "",
      testType: "general",
    });
    setStep(1);
    setErrors({});
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
              <p className="text-white/90">Chọn dịch vụ và thời gian phù hợp</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full"
              aria-label="Đóng modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center mt-6 space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= stepNum ? "bg-white text-blue-900" : "bg-white/20 text-white"
                  }`}
                >
                  {step > stepNum ? <CheckCircleIcon className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-8 h-0.5 ${step > stepNum ? "bg-white" : "bg-white/20"}`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Chọn loại xét nghiệm</h3>
                <RadioGroup
                  value={formData.testType}
                  onValueChange={(value) => handleInputChange("testType", value)}
                  className="grid grid-cols-1 gap-3"
                >
                  {testTypes.map((test) => (
                    <div key={test.id} className="flex items-center space-x-2">
                      <RadioGroup value={test.id} id={test.id} />
                      <Label
                        htmlFor={test.id}
                        className={`flex-1 p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer ${
                          formData.testType === test.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-slate-700">{test.name}</span>
                          <span className="text-blue-900 font-semibold">{test.price}</span>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.testType && (
                  <p className="text-red-500 text-sm mt-2">{errors.testType}</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Chọn hình thức thu mẫu
                </h3>
                <RadioGroup
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange("serviceType", value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroup value="home" id="home" />
                    <Label
                      htmlFor="home"
                      className={`flex-1 p-6 border-2 rounded-lg transition-all duration-200 text-center cursor-pointer ${
                        formData.serviceType === "home"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <HomeIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                      <h4 className="font-semibold text-slate-700 mb-2">
                        Tự thu mẫu tại nhà
                      </h4>
                      <p className="text-sm text-slate-600">
                        Nhận bộ kit xét nghiệm tại nhà và tự thu mẫu
                      </p>
                      <div className="mt-3 text-sm text-blue-600 font-medium">
                        + 50.000đ phí vận chuyển
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroup value="clinic" id="clinic" />
                    <Label
                      htmlFor="clinic"
                      className={`flex-1 p-6 border-2 rounded-lg transition-all duration-200 text-center cursor-pointer ${
                        formData.serviceType === "clinic"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <BuildingIcon className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                      <h4 className="font-semibold text-slate-700 mb-2">
                        Thu mẫu tại cơ sở
                      </h4>
                      <p className="text-sm text-slate-600">
                        Đến cơ sở y tế để thu mẫu xét nghiệm
                      </p>
                      <div className="mt-3 text-sm text-green-600 font-medium">Miễn phí</div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.serviceType && (
                  <p className="text-red-500 text-sm mt-2">{errors.serviceType}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
                >
                  Tiếp Theo
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-blue-900">Thông tin đặt lịch</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-blue-900 flex items-center"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    Họ và Tên *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Nhập họ và tên"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-semibold text-blue-900 flex items-center"
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Số điện thoại *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-blue-900 flex items-center"
                  >
                    <MailIcon className="w-4 h-4 mr-2" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Nhập địa chỉ email"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {formData.serviceType === "home" && (
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-blue-900 flex items-center"
                    >
                      <MapPinIcon className="w-4 h-4 mr-2" />
                      Địa chỉ nhận kit *
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Nhập địa chỉ nhận bộ kit xét nghiệm"
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="preferredDate"
                    className="text-sm font-semibold text-blue-900 flex items-center"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Ngày mong muốn *
                  </Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.preferredDate ? "border-red-500" : ""}
                  />
                  {errors.preferredDate && (
                    <p className="text-red-500 text-sm">{errors.preferredDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="preferredTime"
                    className="text-sm font-semibold text-blue-900 flex items-center"
                  >
                    <ClockIcon className="w-4 h-4 mr-2" />
                    Thời gian mong muốn *
                  </Label>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) => handleInputChange("preferredTime", value)}
                  >
                    <SelectTrigger
                      id="preferredTime"
                      className={errors.preferredTime ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.preferredTime && (
                    <p className="text-red-500 text-sm">{errors.preferredTime}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-semibold text-blue-900 flex items-center"
                  >
                    <AlertCircleIcon className="w-4 h-4 mr-2" />
                    Lưu ý thêm
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("notes", e.target.value)}
                    placeholder="Nhập lưu ý hoặc yêu cầu đặc biệt (nếu có)"
                    className="h-24"
                  />
                  {errors.notes && <p className="text-red-500 text-sm">{errors.notes}</p>}
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Quay Lại
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Xác Nhận Đặt Lịch"
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">Đặt lịch thành công!</h3>
              <p className="text-slate-600 mb-6">
                Chúng tôi đã nhận được yêu cầu đặt lịch của bạn. Nhân viên sẽ liên hệ
                với bạn trong vòng 30 phút để xác nhận.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Mã đặt lịch:</strong> BL{Date.now().toString().slice(-6)}
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  <strong>Thời gian:</strong> {formData.preferredDate} lúc{" "}
                  {formData.preferredTime}
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3"
              >
                Đóng
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};