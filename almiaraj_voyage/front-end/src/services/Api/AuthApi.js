import { axiosClient } from "@/api/axios";

const AuthApi = {
  getCsrfToken: async () => {
    return await axiosClient.get("/sanctum/csrf-cookie", {
      baseURL: import.meta.env.VITE_BACKEND_URL,
    });
  },

  login: async (email, password) => {
    return await axiosClient.post("/login", { email, password });
  },

  register: async (data) => {
    return await axiosClient.post("/register", data);
  },

  forgotPassword: async (email) => {
    return await axiosClient.post("/forgot-password", { email });
  },

  resetPassword: async (data) => {
    return await axiosClient.post("/reset-password", data);
  },

  logout: async () => {
    return await axiosClient.post("/logout");
  },

  getUser: async () => {
    return await axiosClient.get("/user");
  },
};

export default AuthApi;
