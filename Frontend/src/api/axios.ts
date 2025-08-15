import axios from "axios";

export const api = axios.create({
  baseURL: "https://team-collaboration-platform-backend-2.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers as Record<string, string>) = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});
