// import axios, { AxiosRequestConfig } from "axios";

// // Create an axios instance
// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000", // Use environment variable for Vercel
//   withCredentials: true, // If you're using cookies/JWT
// });

// // Attach token automatically to requests
// api.interceptors.request.use((config: AxiosRequestConfig) => {
//   const token = localStorage.getItem("token");
//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });




import axios from "axios";

// export const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
//   withCredentials: false
// });

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

