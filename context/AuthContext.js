import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    tokenType: null,
    phone: null,
    user: null,
  });
  const [loading, setLoading] = useState(true); // ✅ for splash/initial loading

  // ✅ Login function
  const login = async (data) => {
    setAuthData(data); // update context
    setAuthToken(data.token, data.tokenType); // set token for api.js
    try {
      await AsyncStorage.setItem("authData", JSON.stringify(data)); // persist login
    } catch (err) {
      console.log("Failed to save authData:", err);
    }
  };

  // ✅ Logout function
  const logout = async () => {
    setAuthData({ token: null, tokenType: null, phone: null, user: null });
    setAuthToken(null); // remove token from api.js
    try {
      await AsyncStorage.removeItem("authData");
    } catch (err) {
      console.log("Failed to remove authData:", err);
    }
  };

  // ✅ Load saved authData on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const saved = await AsyncStorage.getItem("authData");
        if (saved) {
          const data = JSON.parse(saved);
          setAuthData(data);
          setAuthToken(data.token, data.tokenType);
        }
      } catch (err) {
        console.log("Failed to load authData:", err);
      } finally {
        setLoading(false); // done loading
      }
    };
    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        login,
        logout,
        isLoggedIn: !!authData.token,
        loading, // ✅ expose loading for SplashScreen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
