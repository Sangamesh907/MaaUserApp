import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";
import { AddressContext } from "../context/AddressContext";
import { BASE_URL } from "../services/api";

const CartItemsScreen = ({ navigation }) => {
  const { cartItems, increaseItem, decreaseItem } = useContext(CartContext);
  const { selectedAddress } = useContext(AddressContext);

  const [promoCode, setPromoCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const promoDiscount = promoCode.toUpperCase() === "NEW50" ? 75 : 0;
  const deliveryCharges = 25;
  const tax = 25;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const total = subtotal - promoDiscount + deliveryCharges + tax;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://i.imgur.com/0y8Ftya.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath}`;
  };

  const getItemName = (item) => item.food_name || item.name || item.title || "Unnamed Item";

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        <Text style={styles.itemCount}>{cartItems.length} Items</Text>
      </View>

      {/* Address Box */}
      <TouchableOpacity
        style={styles.addressBox}
        onPress={() => navigation.navigate("AddressList")}
      >
        <Icon name="location-outline" size={22} color="#2ecc71" />
        <View style={{ flex: 1, marginLeft: 10 }}>
          {selectedAddress ? (
            <>
              <Text style={styles.deliverTo}>Deliver to:</Text>
              <Text style={styles.addressText}>
                {selectedAddress.label || "Home"},{" "}
                {selectedAddress.flat_no || ""} {selectedAddress.landmark || ""},{" "}
                {selectedAddress.area || ""}
              </Text>
            </>
          ) : (
            <Text style={styles.addressText}>📍 No Address Selected</Text>
          )}
        </View>
        <Text style={styles.changeText}>{selectedAddress ? "Change" : "Add"}</Text>
      </TouchableOpacity>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <View key={item.food_id || item.id} style={styles.itemCard}>
          <View style={styles.chefRow}>
            <Image source={{ uri: getImageUrl(item.image) }} style={styles.chefImage} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.chefText}>{item.chef || "Chef"}</Text>
              <Text style={styles.locationText}>{item.location || "Location unavailable"}</Text>
            </View>
          </View>

          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{getItemName(item)}</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={() => decreaseItem(item.food_id)}>
                <Icon name="remove-circle-outline" size={25} color="#333" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseItem(item.food_id)}>
                <Icon name="add-circle-outline" size={25} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>₹{item.price * item.quantity}</Text>
          </View>

          {item.subscription && (
            <TouchableOpacity
              style={styles.subscriptionBox}
              onPress={() => setShowSubscriptionModal(true)}
            >
              <Text style={styles.subscriptionText}>{item.subscription}</Text>
              <Text style={styles.subscriptionPrice}>{item.price}/item</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Subscription Modal */}
      <Modal
        visible={showSubscriptionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSubscriptionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowSubscriptionModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose a Subscription Plan</Text>
            {["Monthly Plan | 30 Days", "Weekly Plan | 7 Days"].map((plan, i) => (
              <TouchableOpacity
                key={i}
                style={styles.planBox}
                onPress={() => {
                  setSelectedPlan(plan);
                  setShowSubscriptionModal(false);
                }}
              >
                <Text style={styles.planTitle}>{plan}</Text>
                <Text style={styles.planPrice}>{i === 0 ? "₹60/Meal" : "₹80/Meal"}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      {selectedPlan && <Text style={styles.selectedPlan}>✅ {selectedPlan} selected</Text>}

      {/* Instructions */}
      <View style={styles.inputRow}>
        <Icon name="create-outline" size={20} color="#999" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Any Instructions"
          placeholderTextColor="#999"
          value={instructions}
          onChangeText={setInstructions}
          style={styles.inputField}
        />
      </View>

      {/* Promo Code */}
      <View style={styles.promoRow}>
        <View style={styles.promoInputWrapper}>
          <Icon name="pricetag-outline" size={20} color="#999" style={{ marginLeft: 10 }} />
          <TextInput
            value={promoCode}
            onChangeText={setPromoCode}
            placeholder="Promocode"
            placeholderTextColor="#999"
            style={styles.promoInput}
          />
        </View>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹{subtotal}</Text>
        </View>
        {promoDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.greenText}>Promo ({promoCode.toUpperCase()})</Text>
            <Text style={styles.greenText}>-₹{promoDiscount}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text>Delivery Charges</Text>
          <Text>₹{deliveryCharges}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Tax</Text>
          <Text>₹{tax}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>₹{total}</Text>
        </View>
        {promoDiscount > 0 && <Text style={styles.savingsText}>🎉 You saved ₹{promoDiscount}!</Text>}
      </View>

      {/* Pay Button */}
      <TouchableOpacity style={styles.payButton} onPress={() => navigation.navigate("Payment")}>
        <Text style={styles.payText}>Pay ₹{total}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CartItemsScreen;


// Styles (merged & polished)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 15 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  itemCount: { color: "#e74c3c", fontWeight: "bold" },
  itemCard: { backgroundColor: "#fff", padding: 15, marginHorizontal: 15, marginVertical: 8, borderRadius: 12, elevation: 2 },
  chefRow: { flexDirection: "row", alignItems: "center" },
  chefImage: { width: 45, height: 45, borderRadius: 25, backgroundColor: "#eee" },
  chefText: { fontWeight: "600", fontSize: 14 },
  locationText: { color: "#777", fontSize: 12 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  itemName: { fontSize: 16, fontWeight: "600" },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  quantityText: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 16, fontWeight: "bold" },
  subscriptionBox: { marginTop: 8 },
  subscriptionText: { color: "#3498db", fontWeight: "600" },
  subscriptionPrice: { color: "#555", fontSize: 12 },
  summary: { marginHorizontal: 15, marginTop: 15, padding: 15, backgroundColor: "#f8f8f8", borderRadius: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 3 },
  greenText: { color: "green" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  totalText: { fontWeight: "bold", fontSize: 18 },
  savingsText: { color: "green", textAlign: "right", marginTop: 5 },
  inputRow: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", marginHorizontal: 15, borderRadius: 10, marginTop: 15 },
  inputField: { flex: 1, padding: 10, color: "#000" },
  promoRow: { flexDirection: "row", marginHorizontal: 15, marginTop: 10, alignItems: "center", gap: 10 },
  promoInputWrapper: { flex: 1, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ddd", borderRadius: 10 },
  promoInput: { flex: 1, padding: 10, color: "#000" },
  applyButton: { backgroundColor: "#3498db", paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  applyText: { color: "#fff", fontWeight: "600" },
  addressBox: { flexDirection: "row", alignItems: "center", backgroundColor: "#f3fef5", margin: 15, padding: 15, borderRadius: 10 },
  deliverTo: { fontWeight: "600" },
  addressText: { fontSize: 13, color: "#555" },
  changeText: { color: "#27ae60", fontWeight: "600" },
  payButton: { backgroundColor: "#3498db", marginHorizontal: 15, padding: 15, borderRadius: 12, alignItems: "center", marginBottom: 20 },
  payText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#333" },
  planBox: { padding: 15, backgroundColor: "#f5f5f5", marginBottom: 10, borderRadius: 10 },
  planTitle: { fontSize: 16, fontWeight: "600" },
  planPrice: { color: "#888", marginTop: 4 },
  selectedPlan: { paddingHorizontal: 20, color: "green", marginBottom: 10 },
});
