import React, { createContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    try {
      let permission = Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      let result = await check(permission);

      if (result === RESULTS.DENIED) {
        result = await request(permission);
      }

      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos.coords);
        console.log("📍 Initial Location Fetched:", pos.coords);
      },
      (error) => {
        console.log('Geolocation error:', error);
        Alert.alert('Location Error', 'Failed to fetch location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
