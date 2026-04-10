import axios from "axios";

export const axiosClient = axios.create({
    baseURL:
        import.meta.env.VITE_BACKEND_URL + "/api" || "http://localhost:8000",
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Interceptor لإضافة CSRF token
axiosClient.interceptors.request.use(async (config) => {
    // إذا كان طلب POST, PUT, DELETE
    if (
        config.method === "post" ||
        config.method === "put" ||
        config.method === "delete"
    ) {
        // جلب token من الـ cookie
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
