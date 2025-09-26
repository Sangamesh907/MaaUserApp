// screens/CartScreen.js
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { CartContext } from '../context/CartContext';
import CartEmptyScreen from './CartEmptyScreen';
import CartItemsScreen from './CartItemsScreen';

export default function CartScreen({ navigation }) {
  const { cartItems } = useContext(CartContext);

  // Still loading (null/undefined state)
  if (cartItems === null || cartItems === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00A99D" />
      </View>
    );
  }

  // Show items or empty screen
  return cartItems.length > 0
    ? <CartItemsScreen navigation={navigation} cartItems={cartItems} />
    : <CartEmptyScreen navigation={navigation} />;
}
