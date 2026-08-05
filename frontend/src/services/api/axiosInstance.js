import axios from "axios";

import appConfig from "@config/appConfig";

const axiosInstance = axios.create({
  baseURL: appConfig.apiBaseUrl,

  timeout: appConfig.requestTimeout,

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
