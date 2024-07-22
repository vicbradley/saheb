import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://saheb-api.vercel.app/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authObject = JSON.parse(auth)
      config.headers['Authorization'] = `Bearer ${authObject.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
