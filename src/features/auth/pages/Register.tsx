import { Button } from "@/shared/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Dna, Heart, Shield, Users, Mail, Phone, Home, Lock, User, Eye, EyeOff } from "lucide-react";
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
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      password: values.password,
    };

    try {
      const response = await registerApi(registerData);
      console.log("Đăng ký thành công", response);
      setRegisteredEmail(values.email);
      setShowSuccessModal(true);
      form.reset();
      toast.success("Đăng ký thành công!", {
        duration: 4000,
        position: "top-right",
      });
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

      {/* Left Side - Medical Illustration with DNA */}
      <div className="relative flex items-center justify-center w-1/2 p-12 bg-gradient-to-br from-teal-600 to-blue-900">
        <div className="max-w-md text-center text-white">
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
                          placeholder="Nhập tên đầy đủ"
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu của bạn"
                            className="pl-10 pr-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
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
                            className="pl-10 pr-10 border-gray-300 rounded-lg hover:border-green-500 focus:border-green-500"
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
                    <div className="min-h-[20px]">
                      <FormMessage />
                    </div>
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600">Đăng ký thành công!</DialogTitle>
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
              className="bg-green-600 hover:bg-green-700"
            >
              Đi đến Đăng nhập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-2xl animate-fade-in">
            <div className="relative w-12 h-12 mb-4">
              <svg
                className="animate-spin w-full h-full text-green-600"
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
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="text-green-700 font-semibold text-base tracking-wide">
              Đang tạo tài khoản...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;