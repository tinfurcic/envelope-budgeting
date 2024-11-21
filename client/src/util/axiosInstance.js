import axios from "axios";
import { getToken } from "./tokenService";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api", // API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// This interceptor attaches the token to every request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
