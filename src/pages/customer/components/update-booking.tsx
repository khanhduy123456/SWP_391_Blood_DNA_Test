import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { updatePartialExRequest } from "../api/exRequest.api";
import { getAllService } from "@/pages/staff/api/service.api";
import { getAllSampleMethods } from "@/features/admin/api/sample.api";
import type { Service } from "@/pages/staff/type/service";
import type { SampleMethod } from "@/features/admin/types/method";
import type { ExRequestResponse } from "../types/exRequestPaged";
import { CalendarIcon, ClockIcon, FlaskConicalIcon, UserCircle2Icon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

interface UpdateBookingProps {
  isOpen: boolean;
  onClose: () => void;
  booking: ExRequestResponse | null;
  onUpdateSuccess: () => void;
}

export default function UpdateBooking({ isOpen, onClose, booking, onUpdateSuccess }: UpdateBookingProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [sampleMethods, setSampleMethods] = useState<SampleMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: 0,
    sampleMethodId: 0,
    appointmentTime: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
      if (booking) {
        const bookingDate = new Date(booking.appointmentTime);
        const dateStr = bookingDate.toISOString().split('T')[0];
        const timeStr = bookingDate.toTimeString().slice(0, 5);
        setFormData({
          serviceId: booking.serviceId,
          sampleMethodId: booking.sampleMethodId,
          appointmentTime: `${dateStr}T${timeStr}`,
        });
      } else {
        setFormData({
          serviceId: 0,
          sampleMethodId: 0,
          appointmentTime: '',
        });
      }
    }
  }, [isOpen, booking]);

  const fetchData = async () => {
    try {
      const [serviceList, sampleMethodList] = await Promise.all([
        getAllService(),
        getAllSampleMethods(),
      ]);
      setServices(serviceList);
      setSampleMethods(sampleMethodList);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu dịch vụ và phương pháp lấy mẫu", {
        position: "bottom-right",
        duration: 4000,
      });
    }
  };

  const validateAppointmentTime = (appointmentDate: string, appointmentTime: string): boolean => {
    // Kiểm tra ngày không được trong quá khứ
    if (isPastDate(appointmentDate)) {
      toast.error("Không được chọn ngày trong quá khứ!", {
        position: "bottom-right",
        duration: 4000,
      });
      return false;
    }
    
    // Kiểm tra giờ hợp lệ
    if (!timeOptions.includes(appointmentTime)) {
      toast.error("Giờ không hợp lệ!", {
        position: "bottom-right",
        duration: 4000,
      });
      return false;
    }
    
    // Kiểm tra nếu chọn ngày hôm nay thì giờ phải trong tương lai
    const today = new Date();
    const selectedDate = new Date(appointmentDate);
    if (selectedDate.toDateString() === today.toDateString()) {
      const [selectedHour, selectedMinute] = appointmentTime.split(':').map(Number);
      const currentHour = today.getHours();
      const currentMinute = today.getMinutes();
      
      if (selectedHour < currentHour || (selectedHour === currentHour && selectedMinute <= currentMinute)) {
        toast.error("Không thể chọn giờ đã qua cho ngày hôm nay!", {
          position: "bottom-right",
          duration: 4000,
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    // Kiểm tra xem có thời gian hợp lệ không
    const validTimeSlots = generateValidTimeSlots(formData.appointmentTime);
    if (validTimeSlots.length === 0) {
      toast.error("Không có giờ hẹn khả dụng cho ngày đã chọn!", {
        position: "bottom-right",
        duration: 4000,
      });
      return;
    }

    // Validate appointment time
    const appointmentDate = formData.appointmentTime.split('T')[0];
    const appointmentTime = formData.appointmentTime.split('T')[1];
    if (!validateAppointmentTime(appointmentDate, appointmentTime)) {
      return;
    }

    setLoading(true);
    try {
      await updatePartialExRequest(booking.id, {
        serviceId: formData.serviceId,
        sampleMethodId: formData.sampleMethodId,
        appointmentTime: new Date(formData.appointmentTime).toISOString(),
      });
      
      toast.success("Cập nhật thông tin đặt lịch thành công!", {
        position: "bottom-right",
        duration: 4000,
      });
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin", {
        position: "bottom-right",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getService = (id: number) => services.find(s => s.id === id);
  const getSampleMethod = (id: number) => sampleMethods.find(m => m.id === id);

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

  // Tạo danh sách thời gian hợp lệ cho ngày được chọn
  const generateValidTimeSlots = (selectedDate: string): string[] => {
    const slots: string[] = [];
    const date = new Date(selectedDate);
    const now = new Date();
    
    // Kiểm tra nếu chọn ngày hôm nay
    const isToday = date.toDateString() === now.toDateString();
    
    // Tạo các slot 30 phút từ 7h đến 17h
    for (let h = 7; h <= 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        const slotDate = new Date(date);
        slotDate.setHours(h, m, 0, 0);
        
        // Nếu là ngày hôm nay, chỉ cho phép chọn thời gian trong tương lai
        if (isToday) {
          // Thêm 30 phút vào thời gian hiện tại để đảm bảo có đủ thời gian chuẩn bị
          const minBookingTime = new Date(now);
          minBookingTime.setMinutes(minBookingTime.getMinutes() + 30);
          
          if (slotDate > minBookingTime) {
            const hour = h.toString().padStart(2, '0');
            const min = m.toString().padStart(2, '0');
            slots.push(`${hour}:${min}`);
          }
        } else {
          // Nếu không phải ngày hôm nay, cho phép tất cả slot
          const hour = h.toString().padStart(2, '0');
          const min = m.toString().padStart(2, '0');
          slots.push(`${hour}:${min}`);
        }
      }
    }
    
    return slots;
  };

  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-2xl">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <XIcon size={20} />
          </Button>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-blue-900">
            <div className="bg-blue-100 rounded-full p-2">
              <UserCircle2Icon className="text-blue-700" size={28} />
            </div>
            Cập nhật thông tin đặt lịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Thông tin hiện tại */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FlaskConicalIcon size={20} />
              Thông tin hiện tại
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Dịch vụ:</span>
                <p className="text-blue-800 font-semibold">{getService(booking.serviceId)?.name || `#${booking.serviceId}`}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phương pháp lấy mẫu:</span>
                <p className="text-blue-800 font-semibold">{getSampleMethod(booking.sampleMethodId)?.name || `#${booking.sampleMethodId}`}</p>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Thời gian hẹn:</span>
                <p className="text-blue-800 font-semibold flex items-center gap-1">
                  <ClockIcon size={16} />
                  {new Date(booking.appointmentTime).toLocaleString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          {/* Form cập nhật */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceId" className="text-sm font-semibold text-gray-700">
                  Dịch vụ xét nghiệm
                </Label>
                <Select
                  value={formData.serviceId.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{service.name}</span>
                          <span className="text-xs text-gray-500">{service.price?.toLocaleString()}₫</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleMethodId" className="text-sm font-semibold text-gray-700">
                  Phương pháp lấy mẫu
                </Label>
                <Select
                  value={formData.sampleMethodId.toString()}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sampleMethodId: parseInt(value) }))}
                >
                  <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn phương pháp" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleMethods.map((method) => (
                      <SelectItem key={method.id} value={method.id.toString()}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

             <div className="space-y-2">
               <Label htmlFor="appointmentDate" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                 <CalendarIcon size={16} />
                 Ngày hẹn
               </Label>
               <Input
                 id="appointmentDate"
                 type="date"
                 value={formData.appointmentTime ? formData.appointmentTime.split('T')[0] : ''}
                 onChange={(e) => {
                   const selectedDate = e.target.value;
                   setFormData(prev => ({
                     ...prev,
                     appointmentTime: selectedDate ? `${selectedDate}T` : ''
                   }));
                 }}
                 className="bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                 min={new Date().toISOString().split('T')[0]}
                 required
               />
             </div>

             <div className="space-y-2">
               <Label htmlFor="appointmentTime" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                 <ClockIcon size={16} />
                 Giờ hẹn
               </Label>
               <Select
                 value={formData.appointmentTime.split('T')[1] || ''}
                 onValueChange={(value) => {
                   const date = formData.appointmentTime.split('T')[0];
                   setFormData(prev => ({ ...prev, appointmentTime: `${date}T${value}` }));
                 }}
                 disabled={!formData.appointmentTime || !formData.appointmentTime.split('T')[0]}
               >
                 <SelectTrigger className="bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500">
                   <SelectValue placeholder="Chọn giờ hẹn" />
                 </SelectTrigger>
                 <SelectContent>
                   {formData.appointmentTime && formData.appointmentTime.split('T')[0] && 
                     (() => {
                       const timeSlots = generateValidTimeSlots(formData.appointmentTime.split('T')[0]);
                       if (timeSlots.length === 0) {
                         return (
                           <div className="p-2 text-sm text-gray-500 text-center">
                             Không có giờ hẹn khả dụng cho ngày này
                           </div>
                         );
                       }
                       return timeSlots.map((slot) => (
                         <SelectItem key={slot} value={slot}>
                           {slot}
                         </SelectItem>
                       ));
                     })()
                   }
                 </SelectContent>
               </Select>
               <p className="text-xs text-gray-500">
                 ⏰ Giờ làm việc: 7:00 - 17:00 | ⏱️ Cách nhau 30 phút
               </p>
             </div>

            {/* Thông tin dịch vụ được chọn */}
            {formData.serviceId > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Thông tin dịch vụ đã chọn:</h4>
                <div className="text-sm text-green-700">
                  <p><span className="font-medium">Tên dịch vụ:</span> {getService(formData.serviceId)?.name}</p>
                  <p><span className="font-medium">Mô tả:</span> {getService(formData.serviceId)?.description}</p>
                  <p><span className="font-medium">Giá:</span> {getService(formData.serviceId)?.price?.toLocaleString()}₫</p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                disabled={loading}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold"
                disabled={loading || !formData.serviceId || !formData.sampleMethodId || !formData.appointmentTime}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang cập nhật...
                  </div>
                ) : (
                  "Cập nhật thông tin"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
