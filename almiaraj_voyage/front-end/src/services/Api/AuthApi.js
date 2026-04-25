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
    return await axiosClient.get("/destinationsCl");
  },

  getDestinationServices: async (id) => {
    return await axiosClient.get(`/destinationsCl/${id}/services`);
  },
  getVoyages: async () => {
    return await axiosClient.get("/voyagesCl");
  },
  getHotels: async () => {
    return await axiosClient.get("/hotelsCl");
  },

  getBillets: async () => {
    return await axiosClient.get("/billetsCl");
  },

  getOmraHajj: async () => {
    return await axiosClient.get("/omraHajjCl");
  },
    getOmraHajjDetails: async (id) => {
    return await axiosClient.get(`/omraHajjCl/${id}`);
  },
  getHotelDetails: async (id) => {
    return await axiosClient.get(`/hotelsCl/${id}`);
  },
  getVoyageDetails: async (id) => {
    return await axiosClient.get(`/voyagesCl/${id}`);
  },

  getBilletsDetails: async (id) => {
    return await axiosClient.get(`/billetsCl/${id}`);
  },
};

export default AuthApi;
