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
import { BASE_URL } from "../services/api"; // 👈 import base URL

const CartItemsScreen = ({ navigation }) => {
  const { cartItems, increaseItem, decreaseItem, updateItemName } =
    useContext(CartContext);

  const { selectedAddress } = useContext(AddressContext);

  const [promoCode, setPromoCode] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Dynamic calculation of subtotal, promo, delivery, tax
  const promoDiscount = promoCode.toUpperCase() === "NEW50" ? 75 : 0;
  const deliveryCharges = 25;
  const tax = 25;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal - promoDiscount + deliveryCharges + tax;

  // 👇 helper to resolve image URL correctly
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://i.imgur.com/0y8Ftya.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}${imagePath}`; // backend relative → full URL
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <Text style={styles.itemCount}>{cartItems.length} Items</Text>
      </View>

      {/* Cart Items */}
      {cartItems.map((item) => (
        <View key={item.food_id} style={styles.itemContainer}>
          <View style={styles.chefRow}>
            <Image
              source={{ uri: getImageUrl(item.image) }}
              style={styles.chefImage}
            />
            <View>
              <Text style={styles.chefText}>{item.chef} - Chef</Text>
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.itemRow}>
            <TextInput
              value={item.food_name}
              onChangeText={(text) => updateItemName(item.food_id, text)}
              style={styles.itemNameInput}
            />
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => decreaseItem(item.food_id)}>
                <Icon name="remove" size={16} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => increaseItem(item.food_id)}>
                <Icon name="add" size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.price}>₹{item.price * item.quantity}</Text>
          </View>
        </View>
      ))}

      {/* Subscription Row */}
      <View style={styles.subscriptionRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon
            name="albums-outline"
            size={20}
            color="#333"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.subscriptionText}>Subscription</Text>
        </View>
        <TouchableOpacity onPress={() => setShowSubscriptionModal(true)}>
          <Text style={styles.seePlans}>See Plans</Text>
        </TouchableOpacity>
      </View>
      {selectedPlan && (
        <Text style={{ paddingHorizontal: 20, color: "green" }}>
          ✅ {selectedPlan} selected
        </Text>
      )}

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
            <TouchableOpacity
              style={styles.planBox}
              onPress={() => {
                setSelectedPlan("Monthly Plan");
                setShowSubscriptionModal(false);
              }}
            >
              <Text style={styles.planTitle}>Monthly Package | 30 Days</Text>
              <Text style={styles.planPrice}>₹60/Meal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.planBox}
              onPress={() => {
                setSelectedPlan("Weekly Plan");
                setShowSubscriptionModal(false);
              }}
            >
              <Text style={styles.planTitle}>Weekly Package | 7 Days</Text>
              <Text style={styles.planPrice}>₹80/Meal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Instructions */}
      <View style={styles.instructionInputRow}>
        <Icon
          name="create-outline"
          size={20}
          color="#aaa"
          style={{ marginLeft: 10 }}
        />
        <TextInput
          placeholder="Any Instructions"
          placeholderTextColor="#999"
          value={instructions}
          onChangeText={setInstructions}
          style={styles.instructionInput}
        />
      </View>

      {/* Promo Code */}
      <View style={styles.promoRow}>
        <View style={styles.promoInputWrapper}>
          <Icon
            name="pricetag-outline"
            size={20}
            color="#aaa"
            style={{ marginLeft: 10 }}
          />
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
            <Text style={styles.greenText}>
              Promo - ({promoCode.toUpperCase()})
            </Text>
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
        {promoDiscount > 0 && (
          <Text style={styles.savingsText}>
            Your Total Savings ₹{promoDiscount}
          </Text>
        )}
      </View>

      {/* Address */}
      <View style={styles.addressBox}>
        <Icon name="location-outline" size={20} color="#2ecc71" />
        <View style={{ flex: 1 }}>
          {selectedAddress ? (
            <>
              <Text style={styles.deliverTo}>Deliver to :</Text>
              <Text style={styles.addressText}>
                Latitude: {selectedAddress.latitude.toFixed(6)}, Longitude:{" "}
                {selectedAddress.longitude.toFixed(6)}
              </Text>
            </>
          ) : (
            <Text style={styles.addressText}>📍 No Address Selected</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.changeBtn}
          onPress={() => navigation.navigate("AddAddress")}
        >
          <Text style={styles.changeText}>
            {selectedAddress ? "Change" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payButton}
        onPress={() => navigation.navigate("Payment")}
      >
        <Text style={styles.payText}>Pay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  itemCount: { color: "red", fontWeight: "bold" },
  itemContainer: {
    backgroundColor: "#f8f8f8",
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  chefRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 10,
  },
  chefImage: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#eee" },
  chefText: { fontWeight: "bold", fontSize: 14 },
  locationText: { color: "#555", fontSize: 12 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemNameInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    padding: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 6,
  },
  quantityText: { marginHorizontal: 6 },
  price: { fontWeight: "bold" },
  subscriptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  subscriptionText: { fontWeight: "600", fontSize: 16 },
  seePlans: { color: "#3498db", fontWeight: "bold" },
  instructionInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  instructionInput: { flex: 1, padding: 10, color: "#000" },
  promoRow: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginBottom: 10,
    gap: 10,
  },
  promoInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  promoInput: { flex: 1, paddingHorizontal: 10, color: "#000" },
  applyButton: {
    backgroundColor: "#2980b9",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 6,
  },
  applyText: { color: "#fff", fontWeight: "bold" },
  summary: { paddingHorizontal: 15, marginVertical: 10, gap: 6 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  greenText: { color: "green" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalText: { fontWeight: "bold", fontSize: 18 },
  savingsText: { color: "green", textAlign: "right", marginTop: 5 },
  addressBox: {
    flexDirection: "row",
    backgroundColor: "#f3fef5",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
  },
  deliverTo: { fontWeight: "600" },
  addressText: { fontSize: 12, color: "#555" },
  changeBtn: {
    backgroundColor: "#dff5e1",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  changeText: { color: "#27ae60" },
  payButton: {
    backgroundColor: "#3498db",
    marginHorizontal: 10,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15, color: "#333" },
  planBox: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    marginBottom: 10,
    borderRadius: 10,
  },
  planTitle: { fontSize: 16, fontWeight: "600" },
  planPrice: { color: "#888", marginTop: 4 },
});

export default CartItemsScreen;
