import axiosClient from "@/shared/lib/axiosClient";

const ENDPOINT = {
  LOGIN: "/account/login",
};

// Hàm kiểm tra lỗi là AxiosError
const isAxiosError = (error: unknown): error is { code?: string; isAxiosError: boolean } => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(error && typeof error === "object" && "isAxiosError" in error && (error as any).isAxiosError);
};

export const loginApi = async (email: string, password: string) => {
  const maxRetries = 3;
  const timeout = 10000;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await axiosClient.post(
        ENDPOINT.LOGIN,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "text/plain", // Chỉ thêm nếu BE trả về text
          },
          timeout,
        }
      );
      return response.data;
    } catch (error) {
      attempts++;
        // Kiểm tra xem lỗi có phải là AxiosError và có mã lỗi ECONNABORTED (timeout) không
      if (isAxiosError(error) && error.code === "ECONNABORTED") {
        console.warn(`Timeout occurred. Retrying (${attempts}/${maxRetries})...`);
        if (attempts >= maxRetries) {
          throw new Error("Server quá chậm, thử lại sau.");
        }
      } else {
        // Lỗi khác: dừng retry và ném lỗi luôn
        throw error;
      }
    }
  }
};
