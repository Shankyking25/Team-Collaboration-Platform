import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000", // change to your backend URL
  withCredentials: true, // if you're using cookies/JWT
   headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
