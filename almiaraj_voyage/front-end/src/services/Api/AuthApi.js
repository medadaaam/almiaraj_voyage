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
    // Make sure we have a fresh CSRF token before login
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
  getClient: async () => {
    return await axiosClient.get('/clients')
  }
};

export default AuthApi;
