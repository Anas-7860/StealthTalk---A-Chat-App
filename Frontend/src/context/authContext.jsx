import { createContext, useState, useEffect } from "react";
import API from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await API.get("/api/auth/me");
        const updatedUser = {
          ...res.data,
          profilePicture: res.data.profilePicture
            ? `${import.meta.env.VITE_API_BASE_URL || ''}/${res.data.profilePicture}`
            : null,
        };
        setUser(updatedUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post("/api/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      const updatedUser = {
        ...res.data.user,
        profilePicture: res.data.user.profilePicture
          ? `${import.meta.env.VITE_API_BASE_URL || ''}/${res.data.user.profilePicture}`
          : null,
      };
      setUser(updatedUser);
    } catch (err) {
      throw err.response.data.msg || "Login failed";
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await API.post("/api/auth/register", { username, email, password });
      localStorage.setItem("token", res.data.token);
      const updatedUser = {
        ...res.data.user,
        profilePicture: res.data.user.profilePicture
          ? `${import.meta.env.VITE_API_BASE_URL || ''}/${res.data.user.profilePicture}`
          : null,
      };
      setUser(updatedUser);
    } catch (err) {
      throw err.response.data.msg || "Registration failed";
    }
  };

  const guestLogin = async () => {
    try {
      const res = await API.post("/api/auth/guest");
      localStorage.setItem("token", res.data.token);
      const updatedUser = {
        ...res.data.user,
        profilePicture: res.data.user.profilePicture
          ? `${import.meta.env.VITE_API_BASE_URL || ''}/${res.data.user.profilePicture}`
          : null,
      };
      setUser(updatedUser);
    } catch (err) {
      throw err.response.data.msg || "Guest login failed";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
