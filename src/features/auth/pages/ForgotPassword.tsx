import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { ArrowLeft, Dna, Heart, Mail, Shield, Users, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import * as z from "zod";
import { forgotPasswordApi } from "../api/forgotPass.api";
import toast from "react-hot-toast";

// Định nghĩa schema validation với zod
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
});

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  // Khởi tạo form với react-hook-form và zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await forgotPasswordApi(data.email);
      setEmailSent(true);
      toast.success("Email đặt lại mật khẩu đã được gửi thành công!");
    } catch (error) {
      console.error("Gửi email thất bại:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = () => {
    const email = form.getValues("email");
    if (email) {
      handleForgotPassword({ email });
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
            Khôi Phục Mật Khẩu
          </h1>
          <p className="mb-8 text-lg text-cyan-100 leading-relaxed">
            Hệ thống xét nghiệm ADN an toàn và bảo mật với xác thực email tiên tiến
          </p>

          {/* Enhanced Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full">
                <Shield size={18} className="text-white" />
              </div>
              <span className="text-cyan-100 font-medium">Bảo mật thông tin cá nhân</span>
            </div>
            <div className="flex items-center justify-center space-x-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full">
                <Dna size={18} className="text-white" />
              </div>
              <span className="text-cyan-100 font-medium">Xác thực email an toàn</span>
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
                <div className="text-2xl font-bold text-white">5 phút</div>
                <div className="text-xs text-cyan-200">Gửi email</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24h</div>
                <div className="text-xs text-cyan-200">Hiệu lực</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-xs text-cyan-200">Thành công</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="flex items-center justify-center w-1/2 p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Back to Login Button */}
          <div className="mb-6">
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              <ArrowLeft size={16} className="mr-2" />
              Quay lại đăng nhập
            </Link>
          </div>

          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
              <Mail size={24} className="text-blue-600" />
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-800">Quên Mật Khẩu?</h2>
            <p className="text-gray-600">
              Nhập email của bạn để nhận link đặt lại mật khẩu
            </p>
          </div>

          {!emailSent ? (
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleForgotPassword)} className="space-y-6">
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
                      Đang gửi email...
                    </span>
                  ) : (
                    "Gửi Email Đặt Lại Mật Khẩu"
                  )}
                </Button>
              </form>
            </FormProvider>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-gray-800">Email đã được gửi!</h3>
                <p className="text-gray-600 mb-4">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. 
                  Vui lòng kiểm tra hộp thư và spam folder.
                </p>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="space-y-1 text-left">
                        <li>• Link có hiệu lực trong 24 giờ</li>
                        <li>• Kiểm tra cả thư mục spam</li>
                        <li>• Không chia sẻ link với người khác</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  {loading ? "Đang gửi..." : "Gửi lại email"}
                </Button>
                <Link
                  to="/login"
                  className="block w-full py-3 text-center text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          )}

          <div className="text-center mt-8">
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

export default ForgotPassword; 