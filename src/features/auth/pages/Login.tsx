import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Eye, EyeOff, Heart, Lock, Mail, Shield, Users, Dna } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import * as z from "zod";
import { loginApi, loginApiGoogle } from "../api/login.api";
import toast from "react-hot-toast";
import { UserRoleNames } from "../types/auths.types";

// Định nghĩa interface cho response API
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  roleId: number;
}

// Định nghĩa schema validation với zod
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// Thêm hàm parseJwt để decode accessToken
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
      // Gọi API đăng nhập
      const response: LoginResponse = await loginApi(data.email, data.password);

      // Chuyển roleId thành role string
      const userRole = UserRoleNames[response.roleId as keyof typeof UserRoleNames];
      if (!userRole) {
        throw new Error("Role không hợp lệ");
      }

      // Decode accessToken để lấy id và username
      const payload = parseJwt(response.accessToken);
      const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const username = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      // Lưu accessToken, refreshToken, role, id, username vào localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userRole", userRole);
      if (userId) localStorage.setItem("userId", userId);
      if (username) localStorage.setItem("username", username);

      // Phân quyền dựa trên role
      switch (userRole) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Staff":
          navigate("/staff/booking-assign");
          break;
        case "Manager":
          navigate("/manager/lab-orders");
          break;
        case "Customer":
          navigate("/customer/booking-list");
          break;
        default:
          toast.error("Role không hợp lệ");
          break;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Đăng nhập thất bại:", error);
      // Xử lý lỗi chi tiết hơn
      if (error.response?.status === 400 || error.response?.status === 401) {
        form.setError("password", {
          type: "manual",
          message: "Email hoặc mật khẩu không đúng",
        });
      } else if (error.response?.status === 429) {
        form.setError("password", {
          type: "manual",
          message: "Quá nhiều yêu cầu, vui lòng thử lại sau",
        });
      } else {
        form.setError("password", {
          type: "manual",
          message: "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập Google
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const response: LoginResponse = await loginApiGoogle(credentialResponse.credential);
      const userRole = UserRoleNames[response.roleId as keyof typeof UserRoleNames];
      if (!userRole) {
        throw new Error("Role không hợp lệ");
      }

      // Decode accessToken để lấy id và username
      const payload = parseJwt(response.accessToken);
      const userId = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      const username = payload && payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userRole", userRole);
      if (userId) localStorage.setItem("userId", userId);
      if (username) localStorage.setItem("username", username);

      switch (userRole) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Staff":
          navigate("/staff");
          break;
        case "Manager":
          navigate("/manager/test-management");
          break;
        case "Customer":
          navigate("/customer/booking-list");
          break;
        default:
          toast.error("Role không hợp lệ");
          break;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Đăng nhập Google thất bại:", error);
      const errorMessage = "Đăng nhập Google thất bại, vui lòng thử lại";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Left Side - Enhanced Medical Illustration with DNA */}
      <div className="relative flex items-center justify-center w-1/2 p-12 bg-gradient-to-br from-blue-900 via-teal-800 to-cyan-700 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-blue-400/10 rounded-full -top-20 -left-20 animate-pulse"></div>
          <div className="absolute w-80 h-80 bg-teal-400/10 rounded-full -bottom-16 -right-16 animate-pulse delay-1000"></div>
          <div className="absolute w-64 h-64 bg-cyan-400/10 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-md text-center text-white z-10">
          {/* Enhanced DNA Icon with 3D Effect */}
          <div className="flex justify-center mb-10">
            <div className="relative group">
              <div className="flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-20 h-20 text-white animate-spin-slow drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 1}} />
                      <stop offset="100%" style={{stopColor: '#7dd3fc', stopOpacity: 0.8}} />
                    </linearGradient>
                    <style>
                      {`
                        .dna-helix { animation: helix-spin 8s linear infinite; }
                        @keyframes helix-spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                      `}
                    </style>
                  </defs>
                  <g className="dna-helix">
                    <path
                      d="M6 4c0 4 3 6 6 8s6 4 6 8"
                      strokeLinecap="round"
                      strokeWidth="2"
                      stroke="url(#dnaGradient)"
                    />
                    <path
                      d="M18 4c0 4-3 6-6 8s-6 4-6 8"
                      strokeLinecap="round"
                      strokeWidth="2"
                      stroke="url(#dnaGradient)"
                    />
                    <line x1="6" y1="6" x2="18" y2="6" strokeWidth="1.5" opacity="0.8" />
                    <line x1="6" y1="12" x2="18" y2="12" strokeWidth="1.5" opacity="0.8" />
                    <line x1="6" y1="18" x2="18" y2="18" strokeWidth="1.5" opacity="0.8" />
                  </g>
                </svg>
              </div>
              <div className="absolute flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full -bottom-3 -right-3 shadow-lg animate-pulse">
                <Heart size={20} className="text-white" />
              </div>
              {/* Floating particles */}
              <div className="absolute w-3 h-3 bg-cyan-300 rounded-full top-4 left-4 animate-bounce"></div>
              <div className="absolute w-2 h-2 bg-blue-300 rounded-full top-8 right-6 animate-bounce delay-300"></div>
              <div className="absolute w-2.5 h-2.5 bg-teal-300 rounded-full bottom-6 left-8 animate-bounce delay-700"></div>
            </div>
          </div>

          {/* Enhanced Typography */}
          <h1 className="mb-6 text-4xl font-bold tracking-wide bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            Phân Tích Huyết Thống DNA
          </h1>
          <p className="mb-8 text-lg text-cyan-100 leading-relaxed">
            Giải pháp y tế tiên tiến với công nghệ xét nghiệm ADN chính xác và đáng tin cậy
          </p>

          {/* Enhanced Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full">
                <Shield size={18} className="text-white" />
              </div>
              <span className="text-cyan-100 font-medium">An toàn và bảo mật tuyệt đối</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full">
                <Dna size={18} className="text-white" />
              </div>
              <span className="text-cyan-100 font-medium">Kết quả nhanh chóng, đáng tin cậy</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full">
                <Users size={18} className="text-white" />
              </div>
              <span className="text-cyan-100 font-medium">Hỗ trợ từ chuyên gia y tế</span>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-xs text-cyan-200">Độ chính xác</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-xs text-cyan-200">Thời gian xử lý</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-cyan-200">Khách hàng tin tưởng</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center w-1/2 p-12 bg-white">
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
              
              {/* Quên mật khẩu link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-base font-semibold transition-all bg-blue-600 border-none rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng Nhập Hệ Thống"
                )}
              </Button>
            </form>
            {/* Thêm nút đăng nhập Google */}
            <div className="flex items-center justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={() => {
                  toast.error("Đăng nhập Google thất bại");
                  setLoading(false);
                }}
                useOneTap
                theme="filled_blue"
                size="large"
                text="signin_with"
              />
            </div>
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