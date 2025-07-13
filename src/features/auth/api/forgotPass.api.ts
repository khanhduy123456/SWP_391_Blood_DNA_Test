import axiosClient from "@/shared/lib/axiosClient";
import { isAxiosError } from "axios";

const ENDPOINT = {
    FORGOT_PASSWORD: "/account/forgot-password",
    RESET_PASSWORD: "/account/reset-password",
  };
  
  export const forgotPasswordApi = async (email: string) => {
    const maxRetries = 3;
    const timeout = 10000;
    let attempts = 0;
  
    while (attempts < maxRetries) {
      try {
        const response = await axiosClient.post(
          ENDPOINT.FORGOT_PASSWORD,
          { email },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "text/plain",
            },
            timeout,
          }
        );
        return response.data;
      } catch (error) {
        attempts++;
        if (isAxiosError(error) && error.code === "ECONNABORTED") {
          console.warn(`Timeout when sending forgot password. Retry (${attempts}/${maxRetries})...`);
          if (attempts >= maxRetries) {
            throw new Error("Server quá chậm, vui lòng thử lại sau.");
          }
        } else {
          throw error;
        }
      }
    }
  };

  interface ResetPasswordParams {
    email: string;
    token: string;
    newPassword: string;
  }
  
  export const resetPasswordApi = async (params: ResetPasswordParams) => {
    const maxRetries = 3;
    const timeout = 10000;
    let attempts = 0;
  
    while (attempts < maxRetries) {
      try {
        const response = await axiosClient.post(
          ENDPOINT.RESET_PASSWORD,
          params,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "text/plain",
            },
            timeout,
          }
        );
        return response.data;
      } catch (error) {
        attempts++;
        if (isAxiosError(error) && error.code === "ECONNABORTED") {
          console.warn(`Reset password timeout. Retry (${attempts}/${maxRetries})...`);
          if (attempts >= maxRetries) {
            throw new Error("Server quá chậm khi đặt lại mật khẩu, thử lại sau.");
          }
        } else {
          throw error;
        }
      }
    }
  };
  