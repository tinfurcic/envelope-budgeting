import axios from "axios";
import { getToken } from "../tokenService.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api",
  //baseURL: "https://envelope-budgeting.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token to every request
axiosInstance.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("No token available, proceeding without authentication.");
  }
  return config;
});

// Response Interceptor: Handle Token Expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the request is unauthorized and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await getToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // Retry with the new token
      } catch (err) {
        console.error("Token refresh failed", err);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
