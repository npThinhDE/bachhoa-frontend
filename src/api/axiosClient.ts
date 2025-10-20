import axios, { AxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
} from "../utils/token";

const baseURL = "http://localhost:8080/bachhoa/api";

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});


let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (token) p.resolve(token);
  });
  failedQueue = [];
};

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}
// tự động thêm token xác thực
axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalConfig = err.config as RetryConfig;
    if (!originalConfig) return Promise.reject(err);

    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalConfig.headers = originalConfig.headers ?? {};
            originalConfig.headers["Authorization"] = "Bearer " + token;
            return axiosClient(originalConfig);
          })
          .catch((e) => Promise.reject(e));
      }

      isRefreshing = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        if (data?.accessToken) setAccessToken(data.accessToken);
        if (data?.refreshToken) setRefreshToken(data.refreshToken);
        processQueue(null, data.accessToken);
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers["Authorization"] = "Bearer " + data.accessToken;
        return axiosClient(originalConfig);
      } catch (e) {
        processQueue(e, null);
        clearTokens();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;