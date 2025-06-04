import { z } from "zod";

// Schema cho họ tên
export const fullNameSchema = z
  .string()
  .min(2, "Họ tên phải có ít nhất 2 ký tự")
  .nonempty("Vui lòng nhập họ tên");

// Schema cho email
export const emailSchema = z
  .string()
  .email("Email không hợp lệ")
  .nonempty("Vui lòng nhập email");

// Schema cho số điện thoại Việt Nam
export const phoneSchema = z
  .string()
  .regex(
    /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
    "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam"
  )
  .nonempty("Vui lòng nhập số điện thoại");

// Schema cho địa chỉ
export const addressSchema = z
  .string()
  .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
  .nonempty("Vui lòng nhập địa chỉ");

// Schema cho mật khẩu
export const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    "Mật khẩu phải có ít nhất 6 ký tự và bao gồm cả chữ cái và số"
  )
  .nonempty("Vui lòng nhập mật khẩu");

// Schema cho xác nhận mật khẩu – cần dùng `.refine` khi có toàn bộ form
export const confirmPasswordSchema = z
  .string()
  .nonempty("Vui lòng xác nhận mật khẩu");

// Schema cho checkbox chấp nhận điều khoản
export const termsSchema = z.literal(true, {
  errorMap: () => ({ message: "Vui lòng đồng ý với điều khoản dịch vụ" }),
});

// Schema tổng nếu bạn muốn validate cả form
export const registerFormSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    address: addressSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    terms: termsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;
