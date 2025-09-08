// context/LocationContext.js
import React, { createContext, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// replace with your API key
const GOOGLE_API_KEY = "AIzaSyCzwrbeXIlDLSts1tx4GKT5RqIm505Ne0M";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // lat/lng
  const [address, setAddress] = useState(null);   // human-readable

  const requestLocationPermission = async () => {
    try {
      let permission = Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

      let result = await check(permission);

      if (result === RESULTS.DENIED) {
        result = await request(permission);
      }

      if (Platform.OS === 'android' && Platform.Version >= 29) {
        const bgPermission = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        if (bgPermission === RESULTS.DENIED) {
          await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        }
      }

      return result === RESULTS.GRANTED;
    } catch (error) {
      console.log('Permission error:', error);
      return false;
    }
  };

  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
      } else {
        setAddress("Unknown Location");
      }
    } catch (error) {
      console.log("Geocoding error:", error);
      setAddress("Error fetching location");
    }
  };

  useEffect(() => {
    let watchId;

    const getLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Cannot access location');
        return;
      }

      watchId = Geolocation.watchPosition(
        (pos) => {
          const coords = pos.coords;
          setLocation(coords);
          fetchAddressFromCoords(coords.latitude, coords.longitude);
        },
        (error) => console.log('Geolocation error:', error),
        {
          enableHighAccuracy: true,
          distanceFilter: 10,
          interval: 5000,
          fastestInterval: 2000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    };

    getLocation();

    return () => {
      if (watchId !== undefined) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <LocationContext.Provider value={{ location, address }}>
      {children}
    </LocationContext.Provider>
  );
};
