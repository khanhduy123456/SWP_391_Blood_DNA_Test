import axios from "axios";
import type { AxiosResponse } from "axios";

// Vite sử dụng import.meta.env.VITE_XXX để lấy biến môi trường (phải khai báo trong .env file)
const baseURL = import.meta.env.VITE_API_BASE_URL || "https://cdel-production.up.railway.app/api";

const axiosServices = axios.create({
  baseURL,
  timeout: 120000, // Tăng lên 2 phút
});

axiosServices.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";
    // Thêm token vào header nếu có
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosServices.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err) => {
    return Promise.reject(err);
  },
);

const axiosUpload = axios.create({
  baseURL,
  timeout: 120000, // Tăng lên 2 phút
});

axiosUpload.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "multipart/form-data";
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export const axiosClientUpload = axiosUpload;

export default axiosServices;
