import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MapView, { Marker, Callout, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { LocationContext } from "../context/LocationContext";
import api, { BASE_URL } from "../services/api";

const OrderTrackingScreen = ({ route, navigation }) => {
  const { location } = useContext(LocationContext);
  const { orderId, order: passedOrder } = route.params || {};
  const [order, setOrder] = useState(passedOrder || null);
  const [loading, setLoading] = useState(!passedOrder);
  const mapRef = useRef(null);
  const [chefCoords, setChefCoords] = useState(null);
  const [deliveryCoords, setDeliveryCoords] = useState(null);

  console.log("🔹 Route Params:", route.params);
  console.log("🔹 User Location:", location);

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      console.log("⏳ Fetching order details for ID:", orderId);
      const res = await api.get(`/orders/me/${orderId}`);
      console.log("✅ Order details fetched:", res.data.order);
      setOrder(res.data.order);

      const chefLoc = res.data.order?.chef?.location?.coordinates || [];
      const deliveryLoc = res.data.order?.delivery_boy_location?.coordinates || [];

      if (chefLoc.length === 2) {
        setChefCoords({ latitude: chefLoc[1], longitude: chefLoc[0] });
        console.log("📍 Chef Coords:", chefLoc);
      }
      if (deliveryLoc.length === 2) {
        setDeliveryCoords({ latitude: deliveryLoc[1], longitude: deliveryLoc[0] });
        console.log("📍 Delivery Coords:", deliveryLoc);
      }
    } catch (err) {
      console.log("❌ Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!passedOrder) fetchOrderDetails();
    else {
      const chefLoc = passedOrder?.chef?.location?.coordinates || [];
      const deliveryLoc = passedOrder?.delivery_boy_location?.coordinates || [];
      if (chefLoc.length === 2) setChefCoords({ latitude: chefLoc[1], longitude: chefLoc[0] });
      if (deliveryLoc.length === 2) setDeliveryCoords({ latitude: deliveryLoc[1], longitude: deliveryLoc[0] });
      console.log("🔹 Passed order loaded:", passedOrder);
    }
  }, [orderId]);

  // Fit map markers dynamically
  useEffect(() => {
    if (!loading && location && chefCoords && mapRef.current) {
      const markers = [location, chefCoords];
      if (deliveryCoords) markers.push(deliveryCoords);
      console.log("🔹 Fitting map to markers:", markers);
      mapRef.current.fitToCoordinates(markers, {
        edgePadding: { top: 100, right: 80, bottom: 200, left: 80 },
        animated: true,
      });
    }
  }, [loading, location, chefCoords, deliveryCoords]);

  if (loading || !location) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No order found.</Text>
      </SafeAreaView>
    );
  }

  const chef = order.chef;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE} // Ensure Google Maps provider
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {/* User Marker */}
        <Marker coordinate={location} title="You" pinColor="blue" />

        {/* Chef Marker */}
        {chefCoords && (
          <Marker coordinate={chefCoords} title={chef.name} pinColor="green">
            {chef.profile_pic && (
              <Image source={{ uri: `${BASE_URL}${chef.profile_pic}` }} style={styles.chefMarker} />
            )}
            <Callout>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold" }}>{chef.name}</Text>
                <Text>Chef</Text>
              </View>
            </Callout>
          </Marker>
        )}

        {/* Delivery Boy Marker */}
        {deliveryCoords && (
          <Marker coordinate={deliveryCoords} title={order.delivery_boy_name || "Delivery Boy"} pinColor="red">
            <Image source={require("../assets/delivery-boy.png")} style={styles.deliveryMarker} />
          </Marker>
        )}

        {/* Polyline route */}
        {chefCoords && (
          <Polyline
            coordinates={
              deliveryCoords ? [chefCoords, deliveryCoords, location] : [chefCoords, location]
            }
            strokeColor="#4CAF50"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Bottom Info Panel */}
      <View style={styles.infoPanel}>
        <Text style={styles.infoTitle}>Order ID: {order._id}</Text>
        <Text style={styles.infoText}>Chef: {chef?.name}</Text>
        <Text style={styles.infoText}>Status: {order.status}</Text>
        <Text style={styles.infoText}>ETA: 15-20 mins</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeText}>⬅ Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderTrackingScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  map: { flex: 1 },
  chefMarker: { width: 50, height: 50, borderRadius: 25 },
  deliveryMarker: { width: 40, height: 40 },
  infoPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
  },
  infoTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  infoText: { fontSize: 14, color: "#333", marginBottom: 2 },
  homeButton: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    alignItems: "center",
  },
  homeText: { color: "#fff", fontWeight: "bold" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { fontSize: 16, color: "#666", marginTop: 8 },
});
