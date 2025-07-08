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

      // Lưu accessToken, refreshToken và role vào localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userRole", userRole);

      // Phân quyền dựa trên role
      switch (userRole) {
        case "Admin":
          navigate("/admin/users");
          break;
        case "Staff":
          navigate("/staff");
          break;
        case "Manager":
          navigate("/manager/test-management");
          break;
        case "Customer":
          navigate("/customer");
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

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("userRole", userRole);

      switch (userRole) {
        case "Admin":
          navigate("/admin/dashboard");
          break;
        case "Staff":
          navigate("/staff");
          break;
        case "Manager":
          navigate("/(manager/test-management");
          break;
        case "Customer":
          navigate("/customer");
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
                    <line x1="6" y1="6" x2="18" y2="6" strokeWidth="1" opacity="0.6" />
                    <line x1="6" y1="12" x2="18" y2="12" strokeWidth="1" opacity="0.6" />
                    <line x1="6" y1="18" x2="18" y2="18" strokeWidth="1" opacity="0.6" />
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
        <div className="absolute w-20 h-20 rounded-full top-8 left-8 bg-teal-400/10 animate-pulse"></div>
        <div className="absolute w-14 h-14 rounded-full bottom-12 right-12 bg-white/15 animate-pulse"></div>
      </div>

      {/* Right Side - Login Form */}
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