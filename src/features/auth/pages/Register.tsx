import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Dna, Heart, Shield, Users, Mail, Phone, Home, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { Checkbox } from "@/shared/ui/checkbox";
import { registerFormSchema } from "../schema/registerSchema";
import { registerApi, type RegisterUser } from "../api/register.api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import toast, { Toaster } from "react-hot-toast";

type Register = z.infer<typeof registerFormSchema>;

const RegisterForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingRegisterData, setPendingRegisterData] = useState<Register | null>(null);
  const navigate = useNavigate();

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

  const handleRegister = async (values: Register) => {
    setLoading(true);
    const registerData: RegisterUser = {
      fullName: values.fullName.trim(), // Đảm bảo trim khoảng trắng
      email: values.email.trim().toLowerCase(), // Trim và chuyển về lowercase
      phone: values.phone.trim(), // Trim khoảng trắng
      address: values.address.trim(), // Trim khoảng trắng
      password: values.password,
    };

    try {
      const response = await registerApi(registerData);
      console.log("Đăng ký thành công", response);
      setRegisteredEmail(values.email);
      setShowSuccessModal(false); 
      setShowConfirmDialog(false); 
      form.reset();
      toast.success("Đăng ký thành công! Đang chuyển tới trang đăng nhập...", {
        duration: 2000,
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error: unknown) {
      console.error("Đăng ký thất bại", error);
      let errorMessage = "Đăng ký thất bại, vui lòng kiểm tra lại";

      if (typeof error === "object" && error !== null && "message" in error && typeof (error as { message: unknown }).message === "string") {
        const errMsg = (error as { message: string }).message.toLowerCase();
        errorMessage = errMsg;

        if (errMsg.includes("email")) {
          form.setError("email", { type: "manual", message: "Email đã tồn tại" });
        } else if (errMsg.includes("phone")) {
          form.setError("phone", { type: "manual", message: "Số điện thoại đã được sử dụng" });
        } else if (errMsg.includes("password")) {
          form.setError("password", { type: "manual", message: "Mật khẩu không hợp lệ" });
        } else {
          toast.error(errorMessage, {
            duration: 4000,
            position: "top-right",
          });
        }
      } else {
        toast.error(errorMessage, {
          duration: 4000,
          position: "top-right",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Khi bấm submit form, show dialog xác nhận thay vì gọi luôn handleRegister
  const handleFormSubmit = (values: Register) => {
    setPendingRegisterData(values);
    setShowConfirmDialog(true);
  };

  // Khi xác nhận OK trên dialog
  const handleConfirmRegister = async () => {
    if (pendingRegisterData) {
      setShowConfirmDialog(false);
      await handleRegister(pendingRegisterData);
      setPendingRegisterData(null);
    }
  };

  // Khi huỷ trên dialog
  const handleCancelRegister = () => {
    setShowConfirmDialog(false);
    setPendingRegisterData(null);
  };

  const handleGoToLogin = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setRegisteredEmail("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Toaster />

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

      {/* Right Side - Registration Form */}
      <div className="flex items-center justify-center w-1/2 p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">Đăng Ký Tài Khoản</h2>
            <p className="text-gray-600">
              Tạo tài khoản để truy cập đầy đủ dịch vụ y tế
            </p>
          </div>
          
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                          placeholder="Nhập tên đầy đủ"
                          className="pl-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
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
                            className="pl-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
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
                            className="pl-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
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
                          className="pl-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu của bạn"
                            className="pl-10 pr-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                          >
                            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
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
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu của bạn"
                            className="pl-10 pr-10 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={loading}
                          >
                            {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
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
                          className="text-blue-600 border-gray-300"
                        />
                        <label htmlFor="terms" className="text-sm text-gray-600">
                          Tôi đồng ý với{" "}
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            Điều khoản dịch vụ
                          </a>{" "}
                          và{" "}
                          <a href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                            Chính sách bảo mật
                          </a>
                        </label>
                      </div>
                    </FormControl>
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
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
                className="ml-2 font-semibold text-blue-600 hover:text-blue-800 hover:underline"
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">Đăng ký thành công!</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Tài khoản của bạn với email <strong>{registeredEmail}</strong> đã được tạo thành công.
              Vui lòng đăng nhập để tiếp tục sử dụng dịch vụ.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="mr-2"
            >
              Đóng
            </Button>
            <Button
              onClick={handleGoToLogin}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Đi đến Đăng nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Register Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-blue-700">Xác nhận đăng ký</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-700">
            Thông tin đăng ký này sẽ được sử dụng để đặt lịch xét nghiệm. Vui lòng kiểm tra kỹ trước khi đăng ký.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelRegister}>
              Huỷ
            </Button>
            <Button onClick={handleConfirmRegister} className="bg-blue-600 hover:bg-blue-700">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Loading Overlay */}
      {loading && (
        // 
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-2xl">
    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
    <span className="text-blue-700 font-semibold text-base tracking-wide">
      Đang tạo tài khoản...
    </span>
  </div>
</div>

      )}
    </div>
  );
};

export default RegisterForm;