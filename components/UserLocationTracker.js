import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function UserLocationTracker() {
  const [location, setLocation] = useState(null);

  const requestLocationPermission = async () => {
    let permission = Platform.OS === 'android'
      ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

    const result = await check(permission);
    if (result === RESULTS.DENIED) {
      const req = await request(permission);
      return req === RESULTS.GRANTED;
    }
    return result === RESULTS.GRANTED;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      (pos) => setLocation(pos.coords),
      (error) => Alert.alert('Error', error.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (pos) => setLocation(pos.coords),
      (error) => console.log(error),
      { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 }
    );

    return () => Geolocation.clearWatch(watchId);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>User Location Tracker</Text>
      {location ? (
        <Text>Lat: {location.latitude}, Lon: {location.longitude}</Text>
      ) : (
        <Text>Fetching location...</Text>
      )}
      <Button title="Get Location" onPress={getLocation} />
    </View>
  );
}
