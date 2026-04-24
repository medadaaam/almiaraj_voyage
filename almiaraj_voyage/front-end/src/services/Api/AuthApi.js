import { axiosClient, csrfClient } from "@/api/axios";

const AuthApi = {

  getCsrfToken: async () => {
    try {
      const response = await csrfClient.get("/sanctum/csrf-cookie");
      return response;
    } catch (error) {
      console.error("CSRF token error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    await AuthApi.getCsrfToken();
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
    getDestination: async () => {
    return await axiosClient.get("/destinations");
  },
};

export default AuthApi;
