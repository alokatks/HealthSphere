import axiosInstance from "./axiosInstance";

import tokenStorage from "@/utils/tokenStorage";

axiosInstance.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.removeToken();

      // AuthContext logout / redirect will be connected
      // after the complete authentication flow is finalized.
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;