import axios from "axios";
import { env } from "@/utils/env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout,
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login or handle unauthorized
      console.error("Unauthorized access");
    }
    return Promise.reject(error);
  }
);

export default api;
