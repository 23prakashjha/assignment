// src/services/api.js
import axios from "axios";

const API = axios.create({
  // 👇 IMPORTANT: include `/api` in baseURL if your backend routes start with /api
  baseURL: "https://assignment-w67j.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
