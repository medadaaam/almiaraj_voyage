import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

// Create base axios instance
export const axiosClient = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  }
});

// Create CSRF client (without /api)
export const csrfClient = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  }
});

// Request interceptor for CSRF token
axiosClient.interceptors.request.use((config) => {
  const xsrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  
  if (xsrfToken) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
  }
  
  return config;
});

// Response interceptor for 419 errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 419 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await csrfClient.get("/sanctum/csrf-cookie");
        return axiosClient(originalRequest);
      } catch (csrfError) {
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);