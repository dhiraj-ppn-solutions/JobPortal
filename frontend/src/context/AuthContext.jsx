import { createContext, useContext, useState, useEffect } from "react";
import { profile as getProfile } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const res = await getProfile();
        if (res.data && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Profile refresh failed", err);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await getProfile();
          if (res.data && res.data.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.error("Profile fetch failed, logging out", err);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        refreshProfile,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};