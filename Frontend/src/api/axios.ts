import axios, { AxiosRequestConfig } from "axios";

// Create an axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // Use environment variable for Vercel
  withCredentials: true, // If you're using cookies/JWT
});

// Attach token automatically to requests
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
