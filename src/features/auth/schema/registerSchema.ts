import { z } from "zod";

// Schema cho họ tên - trim khoảng trắng và validate
export const fullNameSchema = z
  .string()
  .transform((val) => val.trim()) // Trim khoảng trắng đầu cuối
  .refine((val) => val.length >= 2, "Họ tên phải có ít nhất 2 ký tự")
  .refine((val) => val.length > 0, "Vui lòng nhập họ tên")
  .refine((val) => !/^\s+$/.test(val), "Họ tên không được chỉ chứa khoảng trắng");

// Schema cho email - trim khoảng trắng và chuyển về lowercase
export const emailSchema = z
  .string()
  .transform((val) => val.trim().toLowerCase()) // Trim và chuyển về lowercase
  .refine((val) => val.length > 0, "Vui lòng nhập email")
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), "Email không hợp lệ");

// Schema cho số điện thoại Việt Nam - trim khoảng trắng
export const phoneSchema = z
  .string()
  .transform((val) => val.trim()) // Trim khoảng trắng đầu cuối
  .refine((val) => val.length > 0, "Vui lòng nhập số điện thoại")
  .refine(
    (val) => /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(val),
    "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam"
  );

// Schema cho địa chỉ - trim khoảng trắng và validate
export const addressSchema = z
  .string()
  .transform((val) => val.trim()) // Trim khoảng trắng đầu cuối
  .refine((val) => val.length >= 5, "Địa chỉ phải có ít nhất 5 ký tự")
  .refine((val) => val.length > 0, "Vui lòng nhập địa chỉ")
  .refine((val) => !/^\s+$/.test(val), "Địa chỉ không được chỉ chứa khoảng trắng");

// Schema cho mật khẩu - trim khoảng trắng
export const passwordSchema = z
  .string()
  .transform((val) => val.trim()) // Trim khoảng trắng đầu cuối
  .refine((val) => val.length > 0, "Vui lòng nhập mật khẩu")
  .refine(
    (val) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(val),
    "Mật khẩu phải có ít nhất 6 ký tự và bao gồm cả chữ cái và số"
  );

// Schema cho xác nhận mật khẩu – trim khoảng trắng
export const confirmPasswordSchema = z
  .string()
  .transform((val) => val.trim()) // Trim khoảng trắng đầu cuối
  .refine((val) => val.length > 0, "Vui lòng xác nhận mật khẩu");

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
