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

  getClientProfile: async () => {
    return await axiosClient.get("/client/profile");
  },
  updateClientProfile: async (data) => {
    return await axiosClient.put("/client/profile", data);
  },

  // ✅ Destination avec Pagination
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

  // ✅ Voyages avec Pagination
  getVoyages: async (page = 1) => {
    return await axiosClient.get(`/voyagesCl?page=${page}`);
  },

  // ✅ Hotels avec Pagination
  getHotels: async (page = 1) => {
    return await axiosClient.get(`/hotelsCl?page=${page}`);
  },

  // ✅ Billets avec Pagination
  getBillets: async (page = 1) => {
    return await axiosClient.get(`/billetsCl?page=${page}`);
  },

  // ✅ Hajj Omra avec Pagination
  getOmraHajj: async (page = 1) => {
    return await axiosClient.get(`/omraHajjCl?page=${page}`);
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

  sendContactMessage: async (data) => {
    return await axiosClient.post("/contact/message", data);
  },
  getMyMessages: async () => {
    return await axiosClient.get("/my-messages");
  },
  getClientMessageDetails(messageId) {
    return axiosClient.get(`/client/messages/${messageId}`);
  },
};

export default AuthApi;
