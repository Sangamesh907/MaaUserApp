import React, { createContext, useState } from "react";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    tokenType: null,
    phone: null,
    user: null,
  });

  const login = (data) => {
    setAuthData(data); // { token, tokenType, phone, user }
    setAuthToken(data.token, data.tokenType); // ✅ pass both to api.js
  };

  const logout = () => {
    setAuthData({ token: null, tokenType: null, phone: null, user: null });
    setAuthToken(null); // remove token
  };

  return (
    <AuthContext.Provider
      value={{
        authData,
        setAuthData,
        login,
        logout,
        isLoggedIn: !!authData.token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
