import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const { authData } = useContext(AuthContext);
  const token = authData?.token;

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await api.get("/user/address");
      if (res.data.status === "success") {
        setAddresses(res.data.address || []);
        if (!selectedAddress && res.data.address?.length > 0) {
          setSelectedAddress(res.data.address[0]); // auto-select first address
        }
      }
    } catch (err) {
      console.log("Error fetching addresses:", err.response?.data || err.message);
      Alert.alert("Error", "Unable to fetch addresses.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add new address
  const addAddress = async (addressObj) => {
    if (!token) return;
    try {
      setIsLoading(true);
      const payload = { user_id: authData.user.id, ...addressObj };
      const res = await api.post("/user/address", payload);
      if (res.data.status === "success") {
        setAddresses((prev) => [...prev, res.data.address]);
        setSelectedAddress(res.data.address); // auto-select new address
        Alert.alert("Success", "Address added successfully!");
      }
    } catch (err) {
      console.log("Error adding address:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete address
  const deleteAddress = async (id) => {
    if (!token) return;
    try {
      setIsLoading(true);
      const res = await api.delete(`/user/address/${id}`);
      if (res.data.status === "success") {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selectedAddress?.id === id) setSelectedAddress(null);
        Alert.alert("Deleted", "Address removed successfully!");
      }
    } catch (err) {
      console.log("Error deleting address:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  const selectAddress = (address) => setSelectedAddress(address);

  useEffect(() => {
    if (token) fetchAddresses();
    else setAddresses([]);
  }, [token]);

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        fetchAddresses,
        addAddress,
        deleteAddress,
        selectAddress,
        isLoading,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
