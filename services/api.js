import axios from "axios";

// Keep this as your API base URL
const api = axios.create({
  baseURL: "http://3.110.207.229/api",
  timeout: 10000,
});

// Place to store token + type in memory
let authToken = null;
let tokenType = "Bearer"; // default

// Function to set token after login
export const setAuthToken = (token, type = "Bearer") => {
  authToken = token;
  tokenType = type;
};

// ✅ Interceptor: attach token to every request
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `${tokenType} ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👇 Export the base server URL for images/static files
export const BASE_URL = "http://3.110.207.229";

export default api;
