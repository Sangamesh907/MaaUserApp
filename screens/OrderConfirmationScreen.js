// screens/OrderConfirmationScreen.js
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
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const ORDER_KEY = `order_${orderId}`;

  // Load order from AsyncStorage first
  const loadCachedOrder = async () => {
    try {
      const cachedOrder = await AsyncStorage.getItem(ORDER_KEY);
      if (cachedOrder) {
        console.log("Loaded order from cache");
        setOrder(JSON.parse(cachedOrder));
        setLoading(false);
      }
    } catch (err) {
      console.log("Error loading cached order:", err);
    }
  };

  // Fetch fresh order from backend and update cache
  const fetchOrderDetails = async () => {
    if (!orderId) return;
    try {
      console.log("Fetching order details from backend for ID:", orderId);
      const res = await api.get(`/orders/${orderId}`);
      console.log("Order fetched:", res.data);
      setOrder(res.data);
      await AsyncStorage.setItem(ORDER_KEY, JSON.stringify(res.data));
    } catch (err) {
      console.log("Error fetching order:", err.response?.data || err.message);
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
        <ActivityIndicator size="large" color="#fff" />
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

  const totalAmount = order.total_amount || order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleImageError = (index) => {
    setImageErrorMap(prev => ({ ...prev, [index]: true }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image source={require("../assets/bowl1.png")} style={styles.bowlImage} />
        <Text style={styles.thankYou}>Thank You</Text>
        <Text style={styles.subText}>You have successfully placed your Order</Text>
      </View>

      <ScrollView style={styles.card} contentContainerStyle={{ alignItems: "center" }}>
        {order.items?.map((item, index) => (
          <View key={item._id || index} style={styles.itemBox}>
            <Image
              source={
                imageErrorMap[index] || !item.photo_url
                  ? require("../assets/dosa.jpg")
                  : { uri: `${BASE_URL}${item.photo_url}` }
              }
              style={styles.foodImage}
              onError={() => handleImageError(index)}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.chefName}>{item.chef_name || "Chef"}</Text>
              <Text style={styles.item}>Item: {item.food_name}</Text>
              <Text style={styles.subText}>Style: {item.food_style || "-"}, Type: {item.food_type || "-"}</Text>
              <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              <Text style={styles.price}>₹{item.price * item.quantity}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.orderNo}>
          Order No: <Text style={{ color: "#00A36C" }}>{order._id}</Text>
        </Text>
        <Text style={styles.total}>Total: ₹{totalAmount}</Text>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate("OrderDelivered", { orderId: order._id })}
        >
          <Text style={styles.trackText}>📍 Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeText}>⬅ Back to Home</Text>
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
    backgroundColor: "#3f7ffb",
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: "center",
  },
  trackText: { color: "white", fontWeight: "bold" },
  homeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    backgroundColor: "#eee",
    alignSelf: "center",
  },
  homeText: { color: "#3f7ffb", fontWeight: "bold" },
});
