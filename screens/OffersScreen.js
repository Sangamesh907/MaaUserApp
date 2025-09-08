// screens/OffersScreen.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OffersListScreen from './OffersListScreen';
import ChefDetailScreen from './ChefDetailScreen';

const Stack = createNativeStackNavigator();

export default function OffersScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OffersList" component={OffersListScreen} />
      <Stack.Screen name="ChefDetail" component={ChefDetailScreen} />
    </Stack.Navigator>
  );
}
