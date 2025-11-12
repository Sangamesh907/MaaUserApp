import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { authData } = useContext(AuthContext);
  const token = authData?.token;

  const [cartItems, setCartItems] = useState([]);
  const [billingSummary, setBillingSummary] = useState(null);

  // ✅ Normalize backend item
  const normalizeItem = (item) => ({
    key: `${item.food_id}-${item.chef_details?.id || ""}`,
    food_id: item.food_id,
    food_name: item.food_name || "",
    price: item.price || 0,
    quantity: item.quantity || 1,
    image: item.photo_url
      ? `http://3.110.207.229${item.photo_url}` // ✅ Full URL for image
      : null,
    chef_name: item.chef_details?.name || "",
    chef_photo: item.chef_details?.photo_url
      ? `http://3.110.207.229${item.chef_details?.photo_url}`
      : null,
    chef_details: item.chef_details || null,
  });

  // ✅ Load local cart
  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem("cart");
      const parsed = stored ? JSON.parse(stored) : [];
      setCartItems(parsed);
    } catch (err) {
      console.log("Load cart error:", err);
    }
  };

  // ✅ Save local cart
  const saveCart = async (updatedCart) => {
    setCartItems(updatedCart);
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (err) {
      console.log("Save cart error:", err);
    }
  };

  // ✅ Fetch from backend
  const fetchCartFromServer = async () => {
    
    try {
      const res = await api.get("/cart/me");
      if (res.data.status === "success") {
        const items = res.data.cart?.items || [];
        const formatted = items.map(normalizeItem);
        const billing = res.data.cart?.billing_summary || null;
        setBillingSummary(billing);
        await saveCart(formatted);
      }
    } catch (err) {
      console.log("Cart fetch error:", err?.response?.data || err.message);
    }
  };

  // ✅ Add item
  const addItem = async (item) => {
    try {
      await api.post("/cart/add", { food_id: item.food_id, quantity: 1 });
      const itemKey = `${item.food_id}-${item.chef_details?.id || ""}`;

      const existingItem = cartItems.find((i) => i.key === itemKey);
      const updatedCart = existingItem
        ? cartItems.map((i) =>
            i.key === itemKey ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...cartItems, normalizeItem({ ...item, quantity: 1 })];

      await saveCart(updatedCart);
      await fetchCartFromServer(); // refresh totals
    } catch (err) {
      console.log("Add cart error:", err?.response?.data || err.message);
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };

  // ✅ Remove item
  const removeItem = async (item, removeAll = false) => {
    try {
      await api.post("/cart/remove", {
        food_id: item.food_id,
        quantity: removeAll ? item.quantity : 1,
      });

      const updatedCart = cartItems
        .map((i) =>
          i.key === item.key
            ? { ...i, quantity: removeAll ? 0 : i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);

      await saveCart(updatedCart);
      await fetchCartFromServer();
    } catch (err) {
      console.log("Remove cart error:", err?.response?.data || err.message);
      Alert.alert("Error", "Failed to remove item.");
    }
  };

  // ✅ Increase item count
  const increaseItem = (itemKey) => {
    const item = cartItems.find((i) => i.key === itemKey);
    if (item) addItem(item);
  };

  // ✅ Decrease item count
  const decreaseItem = (itemKey) => {
    const item = cartItems.find((i) => i.key === itemKey);
    if (item) removeItem(item, item.quantity === 1);
  };

  // ✅ Clear cart completely
  const clearCart = async () => {
    setCartItems([]);
    setBillingSummary(null);
    await AsyncStorage.removeItem("cart");
  };

  // ✅ Place order
  const createOrder = async (address_id, payment_method = "COD") => {
    try {
      const payload = {
        address_id,
        payment_method,
        items: cartItems.map((item) => ({
          food_id: item.food_id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("/orders/create", payload);
      if (res.data.status === "success") {
        await clearCart();
        return res.data.order;
      } else {
        Alert.alert("Error", res.data.message || "Failed to place order.");
        return null;
      }
    } catch (err) {
      console.log("Order create error:", err?.response?.data || err.message);
      Alert.alert("Error", "Failed to place order.");
      return null;
    }
  };

  useEffect(() => {
  const initializeCart = async () => {
    await loadCart();
    if (token) {
      await fetchCartFromServer();
    }
  };
  initializeCart();
}, [token]);


  return (
    <CartContext.Provider
      value={{
        cartItems,
        billingSummary,
        addItem,
        removeItem,
        increaseItem,
        decreaseItem,
        clearCart,
        fetchCartFromServer,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 