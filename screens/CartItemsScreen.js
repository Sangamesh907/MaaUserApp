import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { AddressContext } from "../context/AddressContext";
import api, { BASE_URL } from "../services/api"; // ✅ make sure api.js handles BASE_URL and token

const CartItemsScreen = ({ navigation }) => {
  const { selectedAddress } = useContext(AddressContext);
  const scheme = useColorScheme();
  const dark = scheme === "dark";

  const Colors = {
    bg: dark ? "#000" : "#fff",
    card: dark ? "#111" : "#fff",
    text: dark ? "#fff" : "#000",
    subText: dark ? "#bbb" : "#555",
    icon: dark ? "#fff" : "#000",
    green: "#2ecc71",
  };

  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [instructions, setInstructions] = useState("");

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await api.get("/cart/me");
        if (response.data.status === "success") {
          setCartData(response.data.cart);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: Colors.bg }]}>
        <ActivityIndicator size="large" color={Colors.green} />
        <Text style={{ color: Colors.text, marginTop: 10 }}>Loading Cart...</Text>
      </View>
    );
  }

  if (!cartData || !cartData.items.length) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: Colors.bg }]}>
        <Icon name="cart-outline" size={80} color={Colors.subText} />
        <Text style={{ color: Colors.subText, marginTop: 10, fontSize: 16 }}>
          Your cart is empty.
        </Text>
      </View>
    );
  }

  const { items, billing_summary } = cartData;
  const subtotal = billing_summary?.subtotal ?? 0;
  const platform_fee = billing_summary?.platform_fee ?? 0;
  const gst = billing_summary?.gst ?? 0;
  const delivery_fee = billing_summary?.delivery_fee ?? 0;
  const grand_total = billing_summary?.grand_total ?? 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={Colors.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: Colors.text }]}>My Cart</Text>
        </View>
        <Text style={[styles.itemCount]}> {items.length} Items</Text>
      </View>

      {/* Address */}
      <TouchableOpacity
        style={[styles.addressBox, { backgroundColor: dark ? "#0f4020" : "#f3fef5" }]}
        onPress={() => navigation.navigate("AddressList")}
      >
        <Icon name="location-outline" size={22} color={Colors.green} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          {selectedAddress ? (
            <>
              <Text style={[styles.deliverTo, { color: Colors.text }]}>Deliver to:</Text>
              <Text style={[styles.addressText, { color: Colors.subText }]}>
                {selectedAddress.label} {selectedAddress.flat_no},{" "}
                {selectedAddress.landmark}, {selectedAddress.area}
              </Text>
            </>
          ) : (
            <Text style={[styles.addressText, { color: Colors.subText }]}>
              No Address Selected
            </Text>
          )}
        </View>
        <Text style={[styles.changeText]}>
          {selectedAddress ? "Change" : "Add"}
        </Text>
      </TouchableOpacity>

      {/* Cart Items */}
      {items.map((item, index) => (
        <View key={index} style={[styles.itemCard, { backgroundColor: Colors.card }]}>
          <Image
            source={{
              uri: `${BASE_URL}${item.photo_url}`,
            }}
            style={styles.foodImage}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.itemName, { color: Colors.text }]}>{item.food_name}</Text>
            {item.chef_details && (
              <Text style={[styles.chefSmallText, { color: Colors.subText }]}>
                👨‍🍳 {item.chef_details.name} • {item.chef_details.native_place}
              </Text>
            )}

            <View style={styles.itemBottomRow}>
              <Text style={[styles.quantityText, { color: Colors.text }]}>
                Qty: {item.quantity}
              </Text>
              <Text style={[styles.price, { color: Colors.text }]}>
                ₹{item.price * item.quantity}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Instructions */}
      <View style={[styles.inputRow, { borderColor: Colors.subText }]}>
        <Icon name="create-outline" size={20} color={Colors.subText} style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Any Instructions"
          placeholderTextColor={Colors.subText}
          value={instructions}
          onChangeText={setInstructions}
          style={[styles.inputField, { color: Colors.text }]}
        />
      </View>

      {/* Summary */}
      <View style={[styles.summary, { backgroundColor: dark ? "#111" : "#f8f8f8" }]}>
        <View style={styles.summaryRow}>
          <Text style={{ color: Colors.text }}>Subtotal</Text>
          <Text style={{ color: Colors.text }}>₹{subtotal}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={{ color: Colors.text }}>Platform Fee</Text>
          <Text style={{ color: Colors.text }}>₹{platform_fee}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={{ color: Colors.text }}>GST</Text>
          <Text style={{ color: Colors.text }}>₹{gst}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={{ color: Colors.text }}>Delivery Fee</Text>
          <Text style={{ color: Colors.text }}>₹{delivery_fee}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={[styles.totalText, { color: Colors.text }]}>Total</Text>
          <Text style={[styles.totalText, { color: Colors.text }]}>₹{grand_total}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.payButton]}
        onPress={() =>
  navigation.navigate("Payment", {
    subtotal,
    gst,
    delivery_fee,
    platform_fee,
    totalAmount: grand_total,
  })
}

      >
        <Text style={styles.payText}>Pay ₹{grand_total}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CartItemsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  itemCount: { color: "#e74c3c", fontWeight: "bold" },
  addressBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  deliverTo: { fontWeight: "700", fontSize: 14 },
  addressText: { fontSize: 13, marginTop: 3 },
  changeText: { color: "#27ae60", fontWeight: "600" },
  itemCard: {
    flexDirection: "row",
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemName: { fontSize: 16, fontWeight: "600" },
  chefSmallText: { fontSize: 12 },
  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  quantityText: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 16, fontWeight: "bold" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    margin: 15,
    borderRadius: 10,
  },
  inputField: { flex: 1, padding: 10 },
  summary: {
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  totalText: { fontSize: 18, fontWeight: "700" },
  payButton: {
    backgroundColor: "#3498db",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
