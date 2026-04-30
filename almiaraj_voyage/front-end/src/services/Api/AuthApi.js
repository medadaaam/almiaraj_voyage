// src/services/Api/AuthApi.js
import { axiosClient, csrfClient } from "@/api/axios";

const AuthApi = {
  // ✅ CSRF Token
  getCsrfToken: async () => {
    try {
      const response = await csrfClient.get("/sanctum/csrf-cookie");
      return response;
    } catch (error) {
      console.error("CSRF token error:", error);
      throw error;
    }
  },

  // ✅ Authentification
  login: async (email, password) => {
    await AuthApi.getCsrfToken();
    return await axiosClient.post("/login", { email, password });
  },

  register: async (data) => {
    await AuthApi.getCsrfToken();
    return await axiosClient.post("/register", data);
  },

  logout: async () => {
    return await axiosClient.post("/logout");
  },

  getUser: async () => {
    return await axiosClient.get("/user");
  },

  // ✅ Profil Client
  getClientProfile: async () => {
    return await axiosClient.get("/client/profile");
  },

  updateClientProfile: async (data) => {
    return await axiosClient.put("/client/profile", data);
  },

  // ✅ Mot de passe
  changePassword: async (data) => {
    try {
      const response = await axiosClient.post("/change-password", data);
      return response;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  },

  forgotPassword: async (email) => {
    return await axiosClient.post("/forgot-password", { email });
  },

  resetPassword: async (data) => {
    return await axiosClient.post("/reset-password", data);
  },

  // ✅ Destinations
  getDestination: async (page = 1) => {
    return await axiosClient.get(`/destinationsCl?page=${page}`);
  },
  getAllDestination: async () => {
    return await axiosClient.get("/destinations");
  },

  // Create hotel
  createHotelReservation: async (data) => {
    return await axiosClient.post('/reservations/hotel', data);;
  },

  getDestinationServices: async (id) => {
    return await axiosClient.get(`/destinationsCl/${id}/services`);
  },

  // ✅ Voyages
  getVoyages: async (page = 1) => {
    return await axiosClient.get(`/voyagesCl?page=${page}`);
  },

  getVoyageDetails: async (id) => {
    return await axiosClient.get(`/voyagesCl/${id}`);
  },

  // ✅ Hôtels
  getHotels: async (page = 1) => {
    return await axiosClient.get(`/hotelsCl?page=${page}`);
  },

  getHotelDetails: async (id) => {
    return await axiosClient.get(`/hotelsCl/${id}`);
  },

  // ✅ Billets
  getBillets: async (page = 1) => {
    return await axiosClient.get(`/billetsCl?page=${page}`);
  },

  getBilletsDetails: async (id) => {
    return await axiosClient.get(`/billetsCl/${id}`);
  },

  // ✅ Hajj & Omra
  getOmraHajj: async (page = 1) => {
    return await axiosClient.get(`/omraHajjCl?page=${page}`);
  },

  getOmraHajjDetails: async (id) => {
    return await axiosClient.get(`/omraHajjCl/${id}`);
  },

  // ✅ Réservations
  createVoyageReservation: async (data) => {
    return await axiosClient.post("/reservations/voyage", data);
  },

  createBilletReservation: async (data) => {
    return await axiosClient.post("/billets/reserver", data);
  },

  createHotelReservation: async (data) => {
    return await axiosClient.post("/reservations/hotel", data);
  },

  getMyReservations: async () => {
    return await axiosClient.get("/my-reservations");
  },

  getReservationDetails: async (id) => {
    return await axiosClient.get(`/reservations/${id}`);
  },

  cancelReservation: async (id) => {
    return await axiosClient.put(`/reservations/${id}/cancel`);
  },

  // ✅ Messages
  sendContactMessage: async (data) => {
    return await axiosClient.post("/contact/message", data);
  },

  getMyMessages: async () => {
    return await axiosClient.get("/my-messages");
  },
  getClientMessageDetails(messageId) {
    return axiosClient.get(`/client/messages/${messageId}`);

  },
  checkReservationLimits: async () => {
    try {
      const response = await axiosClient.get("/reservations/check-limits");
      return response.data;
    } catch (error) {
      console.error("Check limits error:", error);
      return {
        success: false,
        limits: null,
        error:
          error.response?.data?.message ||
          "Erreur lors de la vérification des limites",
      };
    }
  },
};

export default AuthApi;
