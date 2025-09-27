// screens/AddAddressScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  KeyboardAvoidingView,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import { AddressContext } from "../context/AddressContext";

const AddAddressScreen = ({ navigation }) => {
  const { addAddress, isLoading } = useContext(AddressContext);

  const [coords, setCoords] = useState(null);
  const [label, setLabel] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");

  // Request location permission for Android
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Get current location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert("Permission denied", "Cannot fetch location without permission");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: Number(position.coords.latitude),
          longitude: Number(position.coords.longitude),
        });
      },
      (err) => {
        Alert.alert("Error", "Unable to fetch location");
        console.log("Location error:", err);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  };

  // Handle save address
  const handleSave = async () => {
    if (!coords || !label || !flatNo || !landmark || !area) {
      Alert.alert("Error", "Please fill all fields and fetch location");
      return;
    }

    const newAddress = {
      id: Date.now().toString(),
      label,
      flat_no: flatNo,
      landmark,
      area,
      coordinates: [coords.longitude, coords.latitude],
      is_default: true,
    };

    try {
      await addAddress(newAddress);
      Alert.alert("Success", "Address added and selected for delivery!");
      navigation.goBack(); // Go back to CartItemsScreen directly
    } catch (err) {
      console.log("Error saving address:", err);
      Alert.alert("Error", "Failed to save address. Please try again.");
    }
  };

  const isFormValid = label && flatNo && landmark && area && coords;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add New Address</Text>

        <TextInput
          style={[styles.input, { color: "#000" }]}
          placeholder="Label (Home / Work)"
          placeholderTextColor="#888"
          value={label}
          onChangeText={setLabel}
        />
        <TextInput
          style={[styles.input, { color: "#000" }]}
          placeholder="Flat No"
          placeholderTextColor="#888"
          value={flatNo}
          onChangeText={setFlatNo}
        />
        <TextInput
          style={[styles.input, { color: "#000" }]}
          placeholder="Landmark"
          placeholderTextColor="#888"
          value={landmark}
          onChangeText={setLandmark}
        />
        <TextInput
          style={[styles.input, { color: "#000" }]}
          placeholder="Area"
          placeholderTextColor="#888"
          value={area}
          onChangeText={setArea}
        />

        <TouchableOpacity style={styles.button} onPress={getCurrentLocation}>
          <Text style={styles.buttonText}>📍 Use Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveBtn, { opacity: isFormValid ? 1 : 0.6 }]}
          onPress={handleSave}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>💾 Save Address</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 12, marginBottom: 15 },
  button: { padding: 16, borderRadius: 10, alignItems: "center", backgroundColor: "#007BFF", marginBottom: 15 },
  saveBtn: { backgroundColor: "#28A745" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
