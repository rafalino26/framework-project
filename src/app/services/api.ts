import axios from "axios";

const API_URL = "https://backend-jtehub-production-83f7.up.railway.app";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Cegah alert jika error berasal dari /auth/login
    if (error.response?.status === 401 && !originalRequest.url.includes("/auth/login")) {
      alert("Session expired! Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }

    return Promise.reject(error);
  }
);

export default api;
