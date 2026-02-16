import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

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
