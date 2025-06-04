import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Eye, EyeOff, Heart, Lock, Mail, Shield, Users, Dna } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

// Định nghĩa schema validation với zod
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Khởi tạo form với react-hook-form và zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      console.log("Dữ liệu giả:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

        // Giả lập đăng nhập thành công
        console.log("Đăng nhập thành công:", data);
      navigate("/");
    } catch (error) {
      console.error("Đăng nhập thất bại:", error);
      form.setError("password", {
        type: "manual",
        message: "Đăng nhập thất bại, vui lòng kiểm tra lại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side - New Medical Illustration with DNA */}
      <div className="relative flex items-center justify-center flex-1 p-12 bg-gradient-to-br from-teal-600 to-blue-900">
        <div className="max-w-lg text-center text-white">
          {/* New DNA Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="flex items-center justify-center w-28 h-28 rounded-full bg-white/10 backdrop-blur-md">
                <svg
                  className="w-16 h-16 text-white animate-spin-slow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <style>
                      {`
                        .dna-helix { animation: helix-spin 6s linear infinite; }
                        @keyframes helix-spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}
                    </style>
                  </defs>
                  <g className="dna-helix">
                    {/* Chuỗi DNA đơn giản hóa */}
                    <path
                      d="M6 4c0 4 3 6 6 8s6 4 6 8"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18 4c0 4-3 6-6 8s-6 4-6 8"
                      strokeLinecap="round"
                      strokeWidth="1.5"
                    />
                    {/* Các điểm nối giữa hai chuỗi */}
                    <line x1="6" y1="6" x2="18" y2="6" strokeWidth="1" opacity="0.6" />
                    <line x1="6" y1="12" x2="18" y2="12" strokeWidth="1" opacity="0.6" />
                    <line x1="6" y1="18" x2="18" y2="18" strokeWidth="1" opacity="0.6" />
                    {/* Biểu tượng DNA nhỏ */}
                    <Dna size={20} className="absolute top-0 left-0 text-teal-300" />
                  </g>
                </svg>
              </div>
              <div className="absolute flex items-center justify-center w-10 h-10 bg-teal-400 rounded-full -bottom-2 -right-2">
                <Heart size={18} className="text-white animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-semibold tracking-wide">Phân Tích Huyết Thống DNA</h1>
          <p className="mb-6 text-lg text-teal-100">
            Giải pháp y tế tiên tiến cho xét nghiệm ADN chính xác
          </p>
          <div className="pt-6 mt-6 space-y-3 border-t border-teal-200/30">
            <div className="flex items-center justify-center space-x-2 text-teal-100">
              <Shield size={16} />
              <span>An toàn và bảo mật</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-teal-100">
              <Dna size={16} />
              <span>Kết quả nhanh chóng, đáng tin cậy</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-teal-100">
              <Users size={16} />
              <span>Hỗ trợ từ chuyên gia y tế</span>
            </div>
          </div>
        </div>
        {/* Hiệu ứng trang trí */}
        <div className="absolute w-20 h-20 rounded-full top-8 left-8 bg-teal-400/10 animate-pulse"></div>
        <div className="absolute w-14 h-14 rounded-full bottom-12 right-12 bg-white/15 animate-pulse"></div>
      </div>

      {/* Right Side - Login Form (giữ nguyên) */}
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <Lock size={24} className="text-blue-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">Đăng Nhập</h2>
            <p className="text-gray-600">
              Truy cập vào hệ thống quản lý y tế của bạn
            </p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Địa chỉ Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Nhập email của bạn"
                            className="pl-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Mật Khẩu
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu của bạn"
                          className="pl-10 pr-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
                          disabled={loading}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-blue-600"
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div> */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base font-semibold transition-all bg-blue-600 border-none rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng Nhập Hệ Thống"
                )}
              </Button>
            </form>
          </FormProvider>

          <div className="text-center mt-6">
            <p className="mb-4 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>Hỗ trợ 24/7</span>
              <span>•</span>
              <span>Bảo mật SSL</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;