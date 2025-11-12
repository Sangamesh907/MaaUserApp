import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import api, { BASE_URL } from "../services/api";

// --- OrderCard Component ---
const OrderCard = ({ order, handleTrackOrder }) => {
  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <Image
          source={{
            uri: order.chef?.profile_pic
              ? `${BASE_URL}${order.chef.profile_pic}`
              : "https://i.pravatar.cc/150",
          }}
          style={styles.avatar}
        />
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{order.chef?.name || "Chef"}</Text>
          <Text style={styles.restaurantLocation}>{order.address?.area || ""}</Text>
        </View>
        <TouchableOpacity style={styles.helpButton}>
          <Feather name="headphones" size={22} color="#4CAF50" />
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Card Body */}
      <View style={styles.cardBody}>
        <View>
          <Text style={styles.detailLabel}>Items</Text>
          <Text style={styles.detailValue}>
            {order.items?.map((item) => item.food_name).join(", ")}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.detailLabel}>Amount</Text>
          <Text style={styles.detailValue}>₹ {order.total_price}</Text>
        </View>
      </View>

      {/* Ordered On */}
      <Text style={styles.orderedOn}>Ordered On</Text>
      <Text style={styles.date}>
        {new Date(order.created_at).toLocaleString("en-US", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      {/* Footer Buttons */}
      <View style={styles.cardFooter}>
        {order.status !== "completed" ? (
          <TouchableOpacity
            style={[styles.button, styles.trackButton]}
            onPress={() => handleTrackOrder(order)}
          >
            <Text style={styles.trackButtonText}>📍 Track Order</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.pastOrderButtons}>
            <TouchableOpacity style={[styles.button, styles.deliveredButton]}>
              <Text style={styles.deliveredButtonText}>Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rateButton]}>
              <Text style={styles.rateButtonText}>Rate Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// --- Main OrderHistoryScreen ---
const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/me");
      setCurrentOrders(res.data.current_orders || []);
      setPastOrders(res.data.past_orders || []);
    } catch (error) {
      console.log("❌ Fetch Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // --- Navigate to professional OrderTrackingScreen ---
  const handleTrackOrder = (order) => {
    navigation.navigate("OrderTracking", { orderId: order._id, order });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.sectionTitle}>Current Orders</Text>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                handleTrackOrder={handleTrackOrder}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No current orders</Text>
          )}

          <Text style={styles.sectionTitle}>Past Orders</Text>
          {pastOrders.length > 0 ? (
            pastOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                handleTrackOrder={handleTrackOrder}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No past orders</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F4F4F4" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  container: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginTop: 20, marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  restaurantInfo: { flex: 1, marginLeft: 12 },
  restaurantName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  restaurantLocation: { fontSize: 14, color: "#666" },
  helpButton: { alignItems: "center" },
  helpText: { fontSize: 12, color: "#4CAF50", marginTop: 2 },
  cardBody: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  detailLabel: { fontSize: 12, color: "#888" },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 2 },
  orderedOn: { fontSize: 12, color: "#888", marginTop: 16 },
  date: { fontSize: 14, color: "#333", marginTop: 2 },
  cardFooter: { marginTop: 16, borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 16 },
  button: { paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  trackButton: { backgroundColor: "#E0F2F1" },
  trackButtonText: { color: "#00796B", fontWeight: "bold" },
  pastOrderButtons: { flexDirection: "row", justifyContent: "space-between" },
  deliveredButton: { borderWidth: 1, borderColor: "#BDBDBD", width: "48%" },
  deliveredButtonText: { color: "#333", fontWeight: "bold" },
  rateButton: { backgroundColor: "#E0F2F1", width: "48%" },
  rateButtonText: { color: "#00796B", fontWeight: "bold" },
  emptyText: { color: "#888", fontSize: 14, paddingVertical: 8, paddingLeft: 8 },
});

export default OrderHistoryScreen;
