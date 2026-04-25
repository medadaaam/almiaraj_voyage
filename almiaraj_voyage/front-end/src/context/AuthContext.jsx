// AuthContext.jsx
import AuthApi from "@/services/Api/AuthApi";
import { createContext, useContext, useState, useEffect } from "react";

const stateContext = createContext({
  user: null,
  authenticated: false,
  destinations: [],
  voyages: [],
  hotels: [],
  billets: [],
  hajjOmras: [],
  setUser: () => {},
  logout: () => {},
  getDestination: () => {},
  getVoyages: () => {},
  getHotels: () => {},
  getBillets: () => {},
  getHajjOmras: () => {},
  setAuthenticated: () => {},
  login: (email, password) => {},
  register: (data) => {},
  getDestinationServices: (id) => {},
  getHotelDetails: (id) => {},
  getBilletsDetails: (id) => {},
  getVoyageDetails: (id) => {},
  getHajjOmraDetails: (id) => {},
  loading: true,
  initialLoading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [destinations, setDestination] = useState([]);
  const [voyages, setVoyage] = useState([]);
  const [hajjOmras, setHajjOmras] = useState([]);
  const [billets, setBillets] = useState([]); // ✅ تصحيح: setBittets → setBillets
  const [hotels, setHotels] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // جلب المستخدم أولاً
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await AuthApi.getUser();
        if (data) {
          setUser(data);
          setAuthenticated(true);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ بعد ما يجيب المستخدم، جلب كل البيانات
  useEffect(() => {
    const fetchAllData = async () => {
      if (loading) return;

      setInitialLoading(true);

      // جلب جميع البيانات بالتوازي
      const promises = [
        getDestination(),
        getVoyages(),
        getHotels(),
        getBillets(),     // ✅ أضفنا billets
        getHajjOmras(),   // ✅ أضفنا hajjOmras
      ];

      await Promise.all(promises);

      setInitialLoading(false);
    };

    fetchAllData();
  }, [loading]);

  const login = async (email, password) => {
    try {
      await AuthApi.getCsrfToken();
      const response = await AuthApi.login(email, password);

      if (response.status === 200 || response.status === 204) {
        const userResponse = await AuthApi.getUser();
        setUser(userResponse.data);
        setAuthenticated(true);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      await AuthApi.getCsrfToken();
      const response = await AuthApi.register(data);

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        const userResponse = await AuthApi.getUser();
        setUser(userResponse.data);
        setAuthenticated(true);
      }
      return response;
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const getDestination = async () => {
    try {
      const response = await AuthApi.getDestination();
      if (response.status === 200 && response.data?.destinations) {
        setDestination(response.data.destinations);
      }
      return response;
    } catch (error) {
      console.error("Recuperation error:", error);
      throw error;
    }
  };

  const getVoyages = async () => {
    try {
      const response = await AuthApi.getVoyages();
      if (response.status === 200 && response.data) {
        setVoyage(response.data);
      }
      return response;
    } catch (error) {
      console.error("Recuperation error:", error);
      throw error;
    }
  };

  const getHajjOmras = async () => {
    try {
      const response = await AuthApi.getOmraHajj();
      if (response.status === 200 && response.data) {
        setHajjOmras(response.data);
      }
      return response;
    } catch (error) {
      console.error("Recuperation error:", error);
      throw error;
    }
  };

  const getBillets = async () => {
    try {
      const response = await AuthApi.getBillets();
      if (response.status === 200 && response.data) {
        setBillets(response.data);
      }
      return response;
    } catch (error) {
      console.error("Recuperation error:", error);
      throw error;
    }
  };

  const getHotels = async () => {
    try {
      const response = await AuthApi.getHotels();
      if (response.status === 200 && response.data) {
        setHotels(response.data);
      }
      return response;
    } catch (error) {
      console.error("Recuperation error:", error);
      throw error;
    }
  };

  const getDestinationServices = async (id) => {
    try {
      console.log("Fetching services for destination:", id);
      const response = await AuthApi.getDestinationServices(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      return null;
    }
  };

  const getHotelDetails = async (id) => {
    try {
      const response = await AuthApi.getHotelDetails(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching hotel details:", error);
      return null;
    }
  };

  const getHajjOmraDetails = async (id) => {
    try {
      const response = await AuthApi.getOmraHajjDetails(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching hajj/omra details:", error);
      return null;
    }
  };

  const getBilletsDetails = async (id) => {
    try {
      const response = await AuthApi.getBilletsDetails(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching billet details:", error);
      return null;
    }
  };

  const getVoyageDetails = async (id) => {
    try {
      const response = await AuthApi.getVoyageDetails(id);
      return response.data;
    } catch (error) {
      console.error("Error fetching voyage details:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await AuthApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setAuthenticated(false);
      setUser(null);
      setDestination([]);
      setVoyage([]);
      setHotels([]);
      setBillets([]);
      setHajjOmras([]);
    }
  };

  return (
    <stateContext.Provider
      value={{
        user,
        login,
        setUser,
        authenticated,
        setAuthenticated,
        logout,
        register,
        loading,
        initialLoading,
        getDestination,
        destinations,
        getVoyages,
        voyages,
        hotels,
        billets,
        hajjOmras,
        getHotels,
        getBillets,
        getHajjOmras,
        getDestinationServices,
        getVoyageDetails,
        getHotelDetails,
        getBilletsDetails,
        getHajjOmraDetails,
      }}
    >
      {children}
    </stateContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(stateContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
