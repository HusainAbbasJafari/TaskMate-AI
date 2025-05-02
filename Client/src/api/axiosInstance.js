import axios from 'axios';

// require('dotenv').config()
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
// console.log("API_URL", process.env.API_URL)


axiosInstance.interceptors.request.use((config) => {
  // console.log("Request URL:", config.url);
  // Skip adding token for login and signup and getusers
  
  if (!config.url.includes('/users/login') && !config.url.includes('/users/signup') && !config.url.includes('/users')) {
    const token = localStorage.getItem('token');
    // console.log("Token being added:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }
  }
  return config;
}, (error) => {
  console.error("Request error:", error);
  return Promise.reject(error);
});

export default axiosInstance;
