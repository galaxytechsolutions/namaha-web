import axios from "axios";

// On localhost use local API; otherwise use production API
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const BASE_URL = isLocalhost
  ? (process.env.REACT_APP_API_URL_LOCAL || "http://localhost:8080/api")
  : (process.env.REACT_APP_API_URL || "https://api.shriaaum.com/api");

const getToken = () => {
  // 1. Check cookies first
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('token='));
    if (tokenCookie) return tokenCookie.split('=')[1];
  }

  // 2. Fallback to localStorage
  return localStorage.getItem('token');
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  console.log("🔑 Token used:", token ? `${token.slice(0, 20)}...` : 'None');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default axiosInstance;
