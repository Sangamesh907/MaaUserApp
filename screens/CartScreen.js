// screens/CartScreen.js
import React, { useContext } from 'react';
import { ActivityIndicator } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartEmptyScreen from './CartEmptyScreen';
import CartItemsScreen from './CartItemsScreen';

export default function CartScreen({ navigation }) {
  const { cartItems } = useContext(CartContext);

  if (!cartItems) return <ActivityIndicator size="large" />;

  return cartItems.length > 0
    ? <CartItemsScreen navigation={navigation} />
    : <CartEmptyScreen navigation={navigation} />;
}
