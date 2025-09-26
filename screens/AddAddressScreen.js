import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import axios from "axios";
import { AddressContext } from "../context/AddressContext";
import { AuthContext } from "../context/AuthContext";

const AddAddressScreen = ({ navigation }) => {
  const { addAddress } = useContext(AddressContext); // ✅ use your existing context
  const { authData } = useContext(AuthContext);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => Alert.alert("Error", "Unable to fetch location"),
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  };

  const handleSaveAddress = async () => {
    if (!currentCoords) {
      Alert.alert("Error", "Please fetch your location first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://13.204.84.41/api/userlocation/update",
        {
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
        },
        { headers: { Authorization: `Bearer ${authData.token}`, "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        // Save to your existing AddressContext
        addAddress({
          latitude: currentCoords.latitude,
          longitude: currentCoords.longitude,
          label: "Current Location",
        });

        Alert.alert("Success", "Location saved successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to save location. Try again.");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Update Location</Text>

      <View style={styles.card}>
        {currentCoords ? (
          <>
            <Text style={styles.coordText}>Latitude: {currentCoords.latitude.toFixed(6)}</Text>
            <Text style={styles.coordText}>Longitude: {currentCoords.longitude.toFixed(6)}</Text>
          </>
        ) : (
          <Text style={styles.coordText}>📍 Location not fetched yet</Text>
        )}
      </View>

      <TouchableOpacity style={[styles.button, styles.locateBtn]} onPress={getCurrentLocation} disabled={isLoading}>
        <Text style={styles.buttonText}>📍 Use Current Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.saveBtn]} onPress={handleSaveAddress} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>💾 Save Location</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddAddressScreen;
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#222" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  coordText: { fontSize: 16, color: "#333", marginBottom: 6 },
  bold: { fontWeight: "bold", color: "#000" },
  button: { padding: 16, borderRadius: 10, alignItems: "center", marginBottom: 15 },
  locateBtn: { backgroundColor: "#007BFF" },
  saveBtn: { backgroundColor: "#28A745" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
