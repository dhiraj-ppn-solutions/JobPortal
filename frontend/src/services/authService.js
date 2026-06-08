import api from "../api/axios";

// Register User
export const register = async (data) => {
  return await api.post("/register", data);
};

// Login User
export const login = async (data) => {
  return await api.post("/login", data);
};

// Get Logged In User
export const profile = async () => {
  return await api.get("/profile");
};

// Logout User
export const logout = async () => {
  return await api.post("/logout");
};