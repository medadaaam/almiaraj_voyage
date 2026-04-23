import AuthApi from "@/services/Api/AuthApi";
import { createContext, useContext, useState, useEffect } from "react";

const stateContext = createContext({
  user: null,
  authenticated: false,
  destinations: [],
  setUser: () => {},
  logout: () => {},
  getDestination: () => {},
  setAuthenticated: () => {},
  login: (email, password) => {},
  register: (data) => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [destinations, setDestination] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthApi.getUser()
      .then(({ data }) => {
        if (data) {
          setUser(data);
          setAuthenticated(true);
        }
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          setAuthenticated(false);
          setUser(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

      if (response.status === 200 || response.status === 201 || response.status === 204) {

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

      if (response.status === 200 || response.status === 201 || response.status === 204) {
        setDestination(response.data.destinations);

      }
      return response;
    } catch (error) {
      console.error("Recuperation error:", error);
      throw error;
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
        getDestination,
        destinations
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
