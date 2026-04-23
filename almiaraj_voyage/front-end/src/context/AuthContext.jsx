import AuthApi from "@/services/Api/AuthApi";
import { createContext, useContext, useState, useEffect } from "react";

const stateContext = createContext({
  user: null,
  client: null,
  authenticated: false,
  setUser: () => {},
  setClient: () => {},
  logout: () => {},
  setAuthenticated: () => {},
  login: (email, password) => {},
  register: (data) => {},
  getClient: () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AuthApi.getUser()
      .then( ({ data }) => {
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

  const getClient = async () => {
    try {
      const { data } = await AuthApi.getClient();

      if (data.client) {
        setClient(data.client);
        return data.client;
      }
    } catch (error) {
      console.error("Error fetching client:", error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      await AuthApi.getCsrfToken();

      const response = await AuthApi.login(email, password);

      if (response.status === 200 || response.status === 204) {
        setAuthenticated(true);

        await getClient();

        return response;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await AuthApi.getCsrfToken();
      const response = await AuthApi.register(userData);

      if (response.status === 200 || response.status === 201) {
        setAuthenticated(true);
        setUser(response.data.user);

        await getClient();
        return response;
      }
    } catch (error) {
      console.error("Register error:", error);
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
        getClient,
        client,
        loading,
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
