import axios from "axios";

export const axiosClient = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL
      ? import.meta.env.VITE_BACKEND_URL + "/api"
      : "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  }
});

// Interceptor لإضافة CSRF token
axiosClient.interceptors.request.use(async (config) => {
  if (
    config.method === "post" ||
    config.method === "put" ||
    config.method === "delete"
  ) {
    const xsrfToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];

    if (xsrfToken) {
      config.headers["X-XSRF-TOKEN"] = decodeURIComponent(xsrfToken);
    }
  }
  return config;
});

// Interceptor للـ Response (معالجة 401)
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       const isAuthPage =
//         window.location.pathname.startsWith("/login") ||
//         window.location.pathname.startsWith("*") ||
//         window.location.pathname.startsWith("/register") ||
//         window.location.pathname.startsWith("/forgot-password") ||
//         window.location.pathname.startsWith("/reset-password") ||
//         window.location.pathname.startsWith("/password-reset");

//       if (!isAuthPage) {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   },
// );
