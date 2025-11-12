// PaymentScreen.js
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import RazorpayCheckout from "react-native-razorpay";

import { AddressContext } from "../context/AddressContext";
import { CartContext } from "../context/CartContext";
import api, { initAuthToken, setAuthToken } from "../services/api";


const PAYMENT_OPTIONS = {
  RAZORPAY: "RAZORPAY",
  COD: "COD",
};

// Payment Option Row Component
const PaymentOptionRow = ({
  iconName,
  iconColor,
  label,
  value,
  selectedValue,
  onSelect,
  isLast = false,
}) => (
  <TouchableOpacity onPress={() => onSelect(value)} activeOpacity={0.7}>
    <View style={styles.optionRow}>
      <Icon name={iconName} size={26} color={iconColor || "#555"} style={styles.icon} />
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={[styles.radio, selectedValue === value && styles.radioSelected]}>
        {selectedValue === value && <View style={styles.radioInner} />}
      </View>
    </View>
    {!isLast && <View style={styles.divider} />}
  </TouchableOpacity>
);

const PaymentScreen = () => {
  const [selectedOption, setSelectedOption] = useState(PAYMENT_OPTIONS.COD);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { selectedAddress, addresses, selectAddress } = useContext(AddressContext);
  const { createOrder } = useContext(CartContext);

  // Restore auth token from storage
  useEffect(() => {
    initAuthToken();
  }, []);

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      const defaultAddr = addresses.find((a) => a.is_default) || addresses[0];
      selectAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  const mapPaymentMethod = (option) => {
    if (option === PAYMENT_OPTIONS.RAZORPAY) return "RAZORPAY";
    if (option === PAYMENT_OPTIONS.COD) return "COD";
    return "OTHER";
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert("Error", "Please select a delivery address first.");
      return;
    }

    const payment_method = mapPaymentMethod(selectedOption);

    if (payment_method === "RAZORPAY") {
      return await handleRazorpayPayment();
    }

    // COD flow
    setLoading(true);
    try {
      const order = await createOrder(selectedAddress.id, payment_method);
      if (order) {
        Alert.alert("Success", "Order placed successfully!");
        navigation.replace("OrderConfirmation", { order });
      }
    } catch (err) {
      console.log("❌ COD order error:", err);
      Alert.alert("Error", "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);

    try {
      console.log("🟧 Creating Razorpay order...");
      const res = await api.post("/orders/create-payment-order");

      const { key, amount, currency, razorpay_order_id, user } = res.data;

      const options = {
        description: "Maa Kitchen Order Payment",
        currency,
        key,
        amount: amount.toString(),
        name: "Maa Kitchen",
        order_id: razorpay_order_id,
        prefill: { name: user.name, email: user.email },
      };

      RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          console.log("✅ Razorpay Success:", paymentData);

          const verifyRes = await api.post("/orders/verify-payment", paymentData);

          if (verifyRes.data.status === "success") {
            Alert.alert("Success", "Payment Successful!");
            navigation.replace("OrderConfirmation", { order: verifyRes.data });
          } else {
            Alert.alert("Error", "Payment verification failed.");
          }
        })
        .catch((err) => {
          console.log("❌ Razorpay Error:", err);
          Alert.alert("Payment Failed", "Transaction cancelled or failed.");
        });
    } catch (error) {
      console.log("❌ Payment Error:", error);
      Alert.alert("Error", "Failed to initiate Razorpay payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity
          style={styles.addressCard}
          onPress={() => navigation.navigate("AddAddress")}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            <Text style={styles.addressText}>
              {selectedAddress
                ? `${selectedAddress.label}: ${selectedAddress.flat_no}, ${selectedAddress.area}`
                : "Select an address"}
            </Text>
          </View>
          <Icon name="chevron-forward-outline" size={24} color="#555" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wallets & UPI</Text>
          <View style={styles.card}>
            <PaymentOptionRow
              iconName="logo-usd"
              label="Razorpay"
              value={PAYMENT_OPTIONS.RAZORPAY}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
            />
            <PaymentOptionRow
              iconName="cash-outline"
              label="Cash on Delivery (COD)"
              value={PAYMENT_OPTIONS.COD}
              selectedValue={selectedOption}
              onSelect={setSelectedOption}
              isLast
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, (loading || !selectedAddress) && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={loading || !selectedAddress}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>
              {selectedOption === PAYMENT_OPTIONS.COD
                ? "Place Order (COD)"
                : "Pay with Razorpay"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8F8F8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#000" },
  scrollViewContent: { padding: 16, paddingBottom: 120 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 10 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: { width: 26, height: 26, marginRight: 16 },
  optionLabel: { flex: 1, fontSize: 16, color: "#333" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: "#3379FF" },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#3379FF" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginLeft: 60 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },
  payButton: {
    backgroundColor: "#3379FF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  addressLabel: { fontWeight: "bold", marginBottom: 4, color: "#333" },
  addressText: { color: "#555", fontSize: 14 },
});
