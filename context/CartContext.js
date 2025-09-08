// context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const loadCart = async () => {
    const stored = await AsyncStorage.getItem('cart');
    setCartItems(stored ? JSON.parse(stored) : []);
  };

  const addItem = async (item) => {
    const updatedCart = [...cartItems, item];
    setCartItems(updatedCart);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = async () => {
    await AsyncStorage.removeItem('cart');
    setCartItems([]);
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addItem, clearCart, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};
