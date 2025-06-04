
import { Button } from "@/shared/ui/button";
import {  FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Activity, Clock, Heart, Shield, UserPlus, Users, Mail, Phone, Home, Lock, User } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import * as z from "zod";
import { Checkbox } from "@/shared/ui/checkbox";
import { registerFormSchema } from "../schema/registerSchema";

type Register = z.infer<typeof registerFormSchema>;

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Khởi tạo form với react-hook-form và zod
  const form = useForm<Register>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      terms: true,
    },
  });

  // Handle registration when form is submitted
  const handleRegister = async (values: Register) => {
    setLoading(true);
    const registerData = {
      FullName: values.fullName,
      Email: values.email,
      Phone: values.phone,
      PasswordHash: values.password,
      Address: values.address,
      Role: "customer",
    };

    try {
      console.log("Dữ liệu giả:", registerData);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      /*
      console.log("Đăng ký thành công", res.data);
      */
    } catch (error) {
      console.error("Đăng ký thất bại", error);
      form.setError("email", {
        type: "manual",
        message: "Đăng ký thất bại, vui lòng kiểm tra lại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Left Side - Medical Registration Image/Illustration */}
      <div className="relative flex items-center justify-center flex-1 p-12 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="text-center text-white max-w">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <style>
                      {`
                        .dna-glow { 
                          filter: drop-shadow(0 0 8px rgba(255,255,255,0.6));
                          animation: dna-pulse 3s ease-in-out infinite;
                        }
                        @keyframes dna-pulse {
                          0%, 100% { opacity: 1; transform: scale(1); }
                          50% { opacity: 0.8; transform: scale(1.05); }
                        }
                      `}
                    </style>
                  </defs>
                  <g className="dna-glow">
                    <path
                      d="M8 2c0 4-2 6-2 10s2 6 2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="8" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="6" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="20" r="1.5" fill="currentColor" />
                    <path
                      d="M16 2c0 4 2 6 2 10s-2 6-2 10"
                      strokeLinecap="round"
                    />
                    <circle cx="16" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="18" cy="16" r="1.5" fill="currentColor" />
                    <circle cx="16" cy="20" r="1.5" fill="currentColor" />
                    <line
                      x1="8"
                      y1="4"
                      x2="16"
                      y2="4"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="6"
                      y1="8"
                      x2="18"
                      y2="8"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="8"
                      y1="12"
                      x2="16"
                      y2="12"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="6"
                      y1="16"
                      x2="18"
                      y2="16"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                    <line
                      x1="8"
                      y1="20"
                      x2="16"
                      y2="20"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.8"
                    />
                  </g>
                </svg>
              </div>
              <div className="absolute flex items-center justify-center w-8 h-8 bg-blue-400 rounded-full -top-2 -right-2 animate-bounce">
                <Activity size={16} className="text-white" />
              </div>
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold">Tham Gia Cùng Chúng Tôi</h1>
          <p className="mb-8 text-xl text-green-100">
            Hành trình kiểm tra toàn diện với dịch vụ ADN huyết thống
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Clock size={20} />
              <span>Đặt lịch khám nhanh chóng</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Shield size={20} />
              <span>Lưu trữ hồ sơ y tế an toàn</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Heart size={20} />
              <span>Theo dõi sức khỏe liên tục</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-green-100">
              <Users size={20} />
              <span>Kết nối với bác sĩ chuyên khoa</span>
            </div>
          </div>
          <div className="pt-8 mt-8 border-t border-white/20">
            <p className="mb-4 text-sm text-green-200">Được tin tưởng bởi</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-white">
              <span className="text-2xl font-bold">50K</span>
              <span>Bệnh nhân</span>
              <span className="text-md"> | </span>
              <span className="text-2xl font-bold">200</span>
              <span>Bác sĩ</span>
              <span className="text-md"> | </span>
              <span className="text-2xl font-bold">15</span>
              <span>Chuyên viên</span>
            </div>
          </div>
        </div>
        <div className="absolute w-14 h-14 rounded-full h-16 top-10 left-10 bg-white bg-opacity-10 rounded-full white/10 top-8 left-8 bg-white/10 animate-pulse"></div>
        <div className="absolute w-12 h-6 h-12 rounded-full bottom-20 rounded-full bg-gray-400 right-white bg-opacity-12 bg-gray-400/20 animate-pulse"></div>
        <div className="absolute w-8 h-8 rounded-full bg-white top-1/3 top-1/3 right-8 bg-white"></div>
        <div className="absolute w-10 h-10 rounded-full bg-emerald-green bottom-300 bg-opacity-20 rounded-full bottom-1/3 left-8 bg-emerald-400/20"></div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center justify-between p-20">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center w-16 h-16 mb-full bg-green-100 rounded-full">
              <UserPlus size={20} className="text-green-600" />
            </div>
            <h2 className="mb-4 text-3xl font-bold">Đăng Ký Tài Khoản</h2>
            <p className="text-gray-600">
              Tạo tài khoản để truy cập đầy đủ dịch vụ y tế
            </p>
          </div>
          
           
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      <span className="text-xs text-red-400">*</span> Họ và tên
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Nhập tên đầy đủ."
                          className="pl-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <div className="min-h-[20px]">
                        <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        <span className="text-xs text-red-400">*</span> Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            className="pl-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                        <div className="min-h-[20px]">
                         <FormMessage />
                        </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        <span className="text-xs text-red-400">*</span> Số điện thoại
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                              {...field}
                              type="tel"
                              inputMode="numeric"
                              pattern="[0-9]*"
                            onKeyDown={(e) => {
                       const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                             if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                             e.preventDefault();
                        }
         }}
                             placeholder="Nhập số điện thoại"
                    className="pl-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                       disabled={loading}
                       />

                        </div>
                      </FormControl>
                      <div className="min-h-[20px]">
                          <FormMessage />  
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      <span className="text-xs text-red-400">*</span> Địa chỉ
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Home size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          placeholder="Nhập địa chỉ của bạn"
                          className="pl-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                          disabled={loading}
                        />
                      </div>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        <span className="text-xs text-red-400">*</span> Mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="Nhập mật khẩu của bạn"
                            className="pl-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        <span className="text-xs text-red-400">*</span> Xác nhận mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="Nhập lại mật khẩu của bạn"
                            className="pl-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                      <div className="min-h-[20px]">
                       <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                          className="text-green-600 border-gray-300"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-green-600 hover:text-green-800 hover:underline">
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-green-600 hover:text-green-800 hover:underline">
                            Chính sách bảo mật
                          </a>
                        </label>
                      </div>
                    </FormControl>
                    <div className="min-h-[20px]"><FormMessage /></div>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base font-semibold transition-all bg-green-600 border-none rounded-lg shadow-lg hover:bg-green-700 hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : (
                  "Tạo Tài Khoản"
                )}
              </Button>
            </form>
          </FormProvider>

          <div className="text-center mt-6">
            <p className="mb-4 text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="ml-2 font-semibold text-green-600 hover:text-green-800 hover:underline"
              >
                Đăng nhập ngay
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Miễn phí đăng ký</span>
              <span>•</span>
              <span>Bảo mật tuyệt đối</span>
              <span>•</span>
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <svg className="animate-spin h-8 w-8 text-green-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span className="text-green-700 font-semibold text-lg">Đang tạo tài khoản...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
