// context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import api, { BASE_URL } from "../services/api"; // ✅ use axios instance

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { authData } = useContext(AuthContext);
  const token = authData?.token;

  const [cartItems, setCartItems] = useState([]);

  // 🔹 Load cart from AsyncStorage
  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem("cart");
      setCartItems(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.log("Load cart error:", err);
    }
  };

  // 🔹 Save cart to AsyncStorage
  const saveCart = async (updatedCart) => {
    setCartItems(updatedCart);
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (err) {
      console.log("Save cart error:", err);
    }
  };

  // 🔹 Fetch cart from backend
  const fetchCartFromServer = async () => {
    if (!token) return;
    try {
      const res = await api.get("/cart/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.status === "success") {
        const items = res.data.cart?.items || [];
        setCartItems(items);
        await AsyncStorage.setItem("cart", JSON.stringify(items));
      }
    } catch (err) {
      console.log("Cart fetch error:", err.response?.data || err.message);
    }
  };

  // 🔹 Add item to cart (backend + local)
  const addItem = async (item) => {
    try {
      await api.post(
        "/cart/add",
        { food_id: item.food_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local
      const existingItem = cartItems.find((i) => i.food_id === item.food_id);
      const updatedCart = existingItem
        ? cartItems.map((i) =>
            i.food_id === item.food_id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...cartItems, { ...item, quantity: 1 }];

      await saveCart(updatedCart);
    } catch (err) {
      console.log("Add cart error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };

  // 🔹 Remove item from cart (backend + local)
  const removeItem = async (item) => {
    try {
      await api.post(
        "/cart/remove",
        { food_id: item.food_id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCart = cartItems
        .map((i) =>
          i.food_id === item.food_id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);

      await saveCart(updatedCart);
    } catch (err) {
      console.log("Remove cart error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to remove item from cart.");
    }
  };

  // 🔹 Increase quantity (calls addItem → backend sync)
  const increaseItem = (food_id) => {
    const item = cartItems.find((i) => i.food_id === food_id);
    if (item) addItem(item);
  };

  // 🔹 Decrease quantity (calls removeItem → backend sync)
  const decreaseItem = (food_id) => {
    const item = cartItems.find((i) => i.food_id === food_id);
    if (item) removeItem(item);
  };

  // 🔹 Update item name locally
  const updateItemName = (food_id, newName) => {
    const updatedCart = cartItems.map((i) =>
      i.food_id === food_id ? { ...i, food_name: newName } : i
    );
    saveCart(updatedCart);
  };

  // 🔹 Clear cart
  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem("cart");
  };

  useEffect(() => {
    loadCart();
    fetchCartFromServer();
  }, [token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        increaseItem,
        decreaseItem,
        updateItemName,
        clearCart,
        fetchCartFromServer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
