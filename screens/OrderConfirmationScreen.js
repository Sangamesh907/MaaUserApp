import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { BASE_URL } from "../services/api";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { orderId, order: passedOrder } = route.params || {};
  const [order, setOrder] = useState(passedOrder || null);
  const [loading, setLoading] = useState(!passedOrder);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const ORDER_KEY = `order_${orderId}`;

  // Load cached order from AsyncStorage
  const loadCachedOrder = async () => {
    if (passedOrder) return; // Already have order
    try {
      const cachedOrder = await AsyncStorage.getItem(ORDER_KEY);
      if (cachedOrder) setOrder(JSON.parse(cachedOrder));
    } catch (err) {
      console.log("[OrderConfirmation] AsyncStorage load error:", err);
    }
  };

  // Fetch fresh order from backend
  const fetchOrderDetails = async () => {
    if (!orderId || passedOrder) return;
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data);
      await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.log("[OrderConfirmation] Fetch order error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCachedOrder().then(fetchOrderDetails);
  }, [orderId]);

  if (loading && !order) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#3f7ffb" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "white", marginTop: 50 }}>No order details available.</Text>
      </View>
    );
  }

  // Ensure items array exists
  const items = order.items || [];

  // Calculate total safely
  const totalAmount = order.total_amount || items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0), 
    0
  );

  const handleImageError = (index) => {
    setImageErrorMap(prev => ({ ...prev, [index]: true }));
  };

  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Image source={require("../assets/bowl1.png")} style={styles.bowlImage} />
        <Text style={styles.thankYou}>Thank You</Text>
        <Text style={styles.subText}>You have successfully placed your Order</Text>
      </View>

      <ScrollView style={styles.card} contentContainerStyle={{ alignItems: "center" }}>
        {items.length > 0 ? items.map((item, index) => (
          <View key={item._id || index} style={styles.itemBox}>
            <Image
              source={
                imageErrorMap[index] || !item.photo_url
                  ? require("../assets/chain.jpg")
                  : { uri: `${BASE_URL}${item.photo_url}` }
              }
              style={styles.foodImage}
              onError={() => handleImageError(index)}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.chefName}>{item.chef_name || "Chef"}</Text>
              <Text style={styles.item}>Item: {item.food_name || "-"}</Text>
              <Text style={styles.subText}>Style: {item.food_style || "-"}, Type: {item.food_type || "-"}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity || 0}</Text>
              <Text style={styles.price}>₹{(item.price || 0) * (item.quantity || 0)}</Text>
            </View>
          </View>
        )) : (
          <Text style={{ marginVertical: 20 }}>No items found for this order.</Text>
        )}

        <Text style={styles.orderNo}>Order No: <Text style={{ color: "#00A36C" }}>{order._id}</Text></Text>
        <Text style={styles.total}>Total: ₹{totalAmount}</Text>

        {/* Track Order Button */}
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate("OrderTracking", { orderId: order._id, order })}
        >
          <Text style={styles.trackText}>📍 Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeText}></Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#3f7ffb" },
  topSection: { alignItems: "center", marginTop: 50 },
  bowlImage: { width: 370, height: 220, resizeMode: "contain" },
  thankYou: { fontSize: 22, fontWeight: "bold", color: "white", marginTop: 20 },
  subText: { color: "white", marginTop: 5 },
  card: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  itemBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
  },
  foodImage: { width: 80, height: 80, borderRadius: 10 },
  chefName: { fontSize: 16, fontWeight: "bold" },
  item: { fontSize: 14 },
  quantity: { fontSize: 14, color: "#555" },
  price: { fontSize: 14, color: "#00A36C", fontWeight: "600" },
  orderNo: { fontSize: 14, marginTop: 10, textAlign: "center" },
  total: { fontSize: 16, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  trackButton: {
    backgroundColor: "#4CAF50",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: "center",
  },
  trackText: { color: "white", fontWeight: "bold", fontSize: 16 },
  homeButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    backgroundColor: "#eee",
    alignSelf: "center",
  },
  homeText: { color: "#3f7ffb", fontWeight: "bold", fontSize: 16 },
});
