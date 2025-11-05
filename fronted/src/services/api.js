import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "https://assignment-w67j.onrender.com", // your backend URL
});

// Attach token automatically if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
