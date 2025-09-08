import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import MainTabs from './screens/MainTabs';
import EditProfileScreen from './screens/EditProfileScreen';
import ExploreFoodStylesScreen from './screens/ExploreFoodStylesScreen';
import ExploreChefsScreen from './screens/ExploreChefsScreen';
import ExploreCuisinesScreen from './screens/ExploreCuisinesScreen';
import ChefOffersScreen from './screens/ChefOffersScreen';
import PaymentScreen from './screens/PaymentScreen';
import AddressScreen from './screens/AddressScreen';
import AddCardScreen from './screens/AddCardScreen';
import FoodScreen from './screens/FoodScreen';
import RestaurantScreenLunch from './screens/RestaurantScreenLunch';
import FaqScreen from './screens/FaqScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import CustomerSupportScreen from './screens/CustomerSupportScreen';
import ChefProfileScreen from './screens/ChefProfileScreen';
import OrderConfirmationScreen from './screens/OrderConfirmationScreen';
import OrderDeliveredScreen from './screens/OrderDeliveredScreen';
import ReviewsScreen from './screens/ReviewsScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen'; 
import OrderDetailScreen from './screens/OrderDetailScreen'; 
import OrderTrackingScreen from './screens/OrderTrackingScreen';
import OffersScreen from './screens/OffersScreen';

// Context
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <LocationProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ExploreFoodStyles" component={ExploreFoodStylesScreen} />
            <Stack.Screen name="ExploreChefs" component={ExploreChefsScreen} />
            <Stack.Screen name="ExploreCuisines" component={ExploreCuisinesScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChefOffers" component={ChefOffersScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Address" component={AddressScreen} />
            <Stack.Screen name="AddCard" component={AddCardScreen} />
            <Stack.Screen name="Food" component={FoodScreen} />
            <Stack.Screen name="RestaurantLunch" component={RestaurantScreenLunch} />
            <Stack.Screen name="FAQ" component={FaqScreen} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
            <Stack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
            <Stack.Screen name="ChefProfile" component={ChefProfileScreen} />
            <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
            <Stack.Screen name="OrderDelivered" component={OrderDeliveredScreen}/>
            <Stack.Screen name="Reviews" component={ReviewsScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
            <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="Offers" component={OffersScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LocationProvider>
    </CartProvider>
  );
}
