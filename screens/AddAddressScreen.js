import React, { useState, useContext, useEffect } from "react";
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
  // IMPORTANT: Remove Image if using a real MapView, but kept here for now
} from "react-native";
// IMPORT MAP COMPONENTS HERE AFTER INSTALLATION:
// import MapView, { Marker } from 'react-native-maps'; 
import Geolocation from "react-native-geolocation-service";
import { AddressContext } from "../context/AddressContext";

const AddAddressScreen = ({ navigation }) => {
  const { addAddress, isLoading } = useContext(AddressContext);

  const [coords, setCoords] = useState(null);
  const [label, setLabel] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");

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
      Alert.alert("Permission denied", "Cannot fetch location without permission");
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({
          latitude: Number(latitude),
          longitude: Number(longitude),
        });
        
        // 🎯 FIX: Pre-fill Area and Landmark to make the form valid after location fetch
        setArea("Fetched Area Name"); 
        setLandmark("Fetched Landmark/Street");
        
        console.log("Location fetched successfully and form fields pre-filled.");
      },
      (err) => {
        Alert.alert("Error", "Unable to fetch location");
        console.log("Location error:", err);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  };
  
  // 🎯 FIX: Automatically fetch location on mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

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
      navigation.goBack();
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
        
        {/* 🎯 MAP COMPONENT STRUCTURE (Not dummy image) */}
        <View style={styles.mapContainer}>
          {/* Replace the Map Placeholder below with:
            <MapView
              style={styles.mapImage}
              region={{
                latitude: coords?.latitude || 12.9716, 
                longitude: coords?.longitude || 77.5946,
                latitudeDelta: 0.005, // Zoom level
                longitudeDelta: 0.005,
              }}
              showsUserLocation={true}
            >
              {coords && <Marker coordinate={coords} title="Your Location" />}
            </MapView>
          */}
          
          {/* Visual Placeholder when using dummy structure */}
          <Text style={styles.mapPlaceholderText}>
              {coords ? `Live Coords: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : "Loading Map..."}
          </Text>


          {coords && (
            <View style={styles.marker}>
              <Text style={styles.markerText}>📍</Text>
            </View>
          )}
        </View>

        {/* Current Location Button - Kept for explicit fetch */}
        <TouchableOpacity style={styles.locationBtn} onPress={getCurrentLocation}>
          <Text style={styles.locationBtnText}>Use Current Location (Refetch)</Text>
        </TouchableOpacity>

        {/* Address Fields */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Flat No"
            placeholderTextColor="#888"
            value={flatNo}
            onChangeText={setFlatNo}
          />
          <TextInput
            style={styles.input}
            placeholder="Landmark (Pre-filled on location fetch)"
            placeholderTextColor="#888"
            value={landmark}
            onChangeText={setLandmark}
          />
          <TextInput
            style={styles.input}
            placeholder="Area (Pre-filled on location fetch)"
            placeholderTextColor="#888"
            value={area}
            onChangeText={setArea}
          />
        </View>

        {/* Label Selection */}
        <View style={styles.labelRow}>
          {["Home", "Work", "Other"].map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.labelBox, label === l && styles.selectedLabelBox]}
              onPress={() => setLabel(l)}
            >
              <Text style={[styles.labelText, label === l && styles.selectedLabelText]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirm Location Button */}
        <TouchableOpacity
          style={[styles.saveBtn, { opacity: isFormValid ? 1 : 0.6 }]}
          onPress={handleSave}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Confirm Location</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 16 },
  
  // Updated Map Container to support a real MapView
  mapContainer: {
    height: 300, // Increased map height slightly for better visibility
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
  },
  // Style for a real MapView component
  mapImage: { width: "100%", height: "100%" }, 
  mapPlaceholderText: {
    padding: 20,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  marker: {
    position: "absolute",
    top: "45%",
    left: "45%",
  },
  markerText: { fontSize: 24 },
  locationBtn: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  locationBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  form: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    color: "#000",
  },
  labelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  labelBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedLabelBox: { backgroundColor: "#007BFF", borderColor: "#007BFF" },
  labelText: { fontWeight: "600", color: "#333" },
  selectedLabelText: { color: "#fff" },
  saveBtn: { backgroundColor: "#007BFF", padding: 16, borderRadius: 12, alignItems: "center" },
  saveBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});