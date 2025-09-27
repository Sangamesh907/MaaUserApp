import axios from "axios";

const api = axios.create({
  baseURL: "http://3.110.207.229/api",
  timeout: 10000,
});

let authToken = null;
let tokenType = "Bearer";

// Set token after login
export const setAuthToken = (token, type = "Bearer") => {
  authToken = token;
  tokenType = type;
  console.log("Auth token set:", authToken);
};

// Interceptor: attach token to every request
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `${tokenType} ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const BASE_URL = "http://3.110.207.229";

export default api;
