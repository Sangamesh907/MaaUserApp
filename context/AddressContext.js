// context/AddressContext.js
import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]); // Array of {latitude, longitude}
  const [selectedAddress, setSelectedAddress] = useState(null); // One selected location
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Load from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedAddresses = await AsyncStorage.getItem("@user_addresses");
        const savedSelected = await AsyncStorage.getItem("@selected_address");

        if (savedAddresses) {
          setAddresses(JSON.parse(savedAddresses));
        }
        if (savedSelected) {
          setSelectedAddress(JSON.parse(savedSelected));
        }
      } catch (e) {
        console.log("Error loading addresses:", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (isInitialLoad.current) {
      loadData();
      isInitialLoad.current = false;
    }
  }, []);

  // Save changes
  useEffect(() => {
    if (!isLoading) {
      const saveData = async () => {
        try {
          await AsyncStorage.setItem(
            "@user_addresses",
            JSON.stringify(addresses)
          );
          await AsyncStorage.setItem(
            "@selected_address",
            JSON.stringify(selectedAddress)
          );
        } catch (e) {
          console.log("Error saving addresses:", e);
        }
      };
      saveData();
    }
  }, [addresses, selectedAddress, isLoading]);

  // Add new location (lat/lng only)
  const addAddress = (coords) => {
    const newAddress = {
      id: Date.now().toString(), // unique ID
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress); // auto-select the latest
  };

  // Update existing location
  const editAddress = (updated) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );
    if (selectedAddress?.id === updated.id) {
      setSelectedAddress(updated);
    }
  };

  // Delete location
  const deleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        addAddress,
        editAddress,
        deleteAddress,
        selectAddress,
        isLoading,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
