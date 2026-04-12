import AuthApi from "@/services/Api/AuthApi";
import { createContext, useContext, useState, useEffect } from "react";

const stateContext = createContext({
  user: null,
  authenticated: false,
  setUser: () => {},
  logout: () => {},
  setAuthenticated: () => {},
  login: (email, password) => {},
  register: (data) => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authenticated, _setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const setAuthenticated = (isAuthenticated) => {
    _setAuthenticated(isAuthenticated);
    localStorage.setItem("ATHENTIFCATED", isAuthenticated);
  };

  useEffect(() => {
    AuthApi.getUser()
      .then(({ data }) => {
        setUser(data);
        _setAuthenticated(true);
      })
      .catch(() => {
        _setAuthenticated(false);
        setUser(null);
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
        setAuthenticated(true);
        if (response.data.user) {
          setUser(response.data.user);
        }
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
      if (response.status === 200 || response.status === 204) {
        setAuthenticated(true);
        if (response.data.user) {
          setUser(response.data.user);
        }
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
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
      localStorage.removeItem("ATHENTIFCATED");
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
