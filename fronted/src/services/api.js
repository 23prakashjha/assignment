// src/services/api.js
import axios from "axios";

// ✅ Create a configured Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api", // 👈 Change if your backend runs on another port or path
  withCredentials: false, // Set to true if backend uses cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token (if it exists)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Optional: centralized error logging (helps debugging 404s or 500s)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        `❌ API Error: ${error.response.status} - ${error.response.config.url}`,
        error.response.data
      );
    } else {
      console.error("❌ API Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default API;

