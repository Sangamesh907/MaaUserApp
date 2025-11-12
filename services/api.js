// services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://3.110.207.229/api",
  timeout: 10000,
});

let authToken = null;
let tokenType = "Bearer";

/**
 * Set auth token in memory and AsyncStorage
 * @param {string} token - JWT token
 * @param {string} type - token type, default "Bearer"
 */
export const setAuthToken = async (token, type = "Bearer") => {
  authToken = token;
  tokenType = type;
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("tokenType", type);
  console.log("✅ Auth token set:", authToken);
};

/**
 * Clear auth token (logout)
 */
export const clearAuthToken = async () => {
  authToken = null;
  tokenType = "Bearer";
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("tokenType");
  console.log("✅ Auth token cleared");
};

/**
 * Initialize auth token from AsyncStorage
 */
export const initAuthToken = async () => {
  const token = await AsyncStorage.getItem("token");
  const type = (await AsyncStorage.getItem("tokenType")) || "Bearer";
  if (token) {
    authToken = token;
    tokenType = type;
    console.log("✅ Auth token initialized from storage:", authToken);
  }
};

// Axios interceptor to attach token to every request
api.interceptors.request.use(
  async (config) => {
    if (!authToken) {
      // try reading from AsyncStorage if memory token is null
      const token = await AsyncStorage.getItem("token");
      const type = (await AsyncStorage.getItem("tokenType")) || "Bearer";
      if (token) {
        authToken = token;
        tokenType = type;
      }
    }

    if (authToken) {
      config.headers.Authorization = `${tokenType} ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const BASE_URL = "http://3.110.207.229";

export default api;
