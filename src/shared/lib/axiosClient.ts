import axios from "axios";
import type { AxiosResponse } from "axios";

// Vite sử dụng import.meta.env.VITE_XXX để lấy biến môi trường (phải khai báo trong .env file)
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const axiosServices = axios.create({
  baseURL,
  timeout: 50000,
});

axiosServices.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";
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
  timeout: 50000,
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
