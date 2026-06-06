// src/hooks/useAxios.js
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const useAxios = () => {
  const { user } = useAuth();

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      async (config) => {
        if (user) {
          try {
            const token = await user.getIdToken();
            config.headers["Authorization"] = `Bearer ${token}`;
          } catch (err) {
            // silently fail
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [user]);

  return axiosInstance;
};

export default useAxios;
