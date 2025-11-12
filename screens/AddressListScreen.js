import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { AddressContext } from "../context/AddressContext";

const getAddressIcon = (label) => {
  const lower = label?.toLowerCase() || "";
  if (lower.includes("home")) return "home-outline";
  if (lower.includes("work")) return "briefcase-outline";
  return "map-marker-outline";
};

const AddressListScreen = ({ navigation }) => {
  const { addresses, fetchAddresses, selectAddress, deleteAddress, selectedAddress, isLoading } =
    useContext(AddressContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSelect = (item) => {
    selectAddress(item);
    setMenuVisible(false);
    navigation.goBack();
  };

  const handleDelete = (item) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteAddress(item.id);
            fetchAddresses();
          },
        },
      ],
      { cancelable: true }
    );
    setMenuVisible(false);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, selectedAddress?.id === item.id && styles.selectedCard]}>
      <View style={styles.cardHeader}>
        <View style={styles.rowLeft}>
          <MaterialCommunityIcon
            name={getAddressIcon(item.label)}
            size={24}
            color={selectedAddress?.id === item.id ? "#007BFF" : "#555"}
          />
          <Text style={styles.label}>{item.label}</Text>
        </View>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => {
            setCurrentItem(item);
            setMenuVisible(true);
          }}
        >
          <Icon name="ellipsis-vertical" size={22} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.addressText}>
        {item.flat_no}, {item.landmark}, {item.area}
      </Text>
    </View>
  );

  if (isLoading)
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007BFF" />;

  return (
    <View style={styles.container}>
      {addresses.length === 0 ? (
        <Text style={styles.empty}>No addresses found. Add one!</Text>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddAddress")}
      >
        <Text style={styles.addBtnText}>+ Add New Address</Text>
      </TouchableOpacity>

      {/* Three-dot menu modal */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleSelect(currentItem)}
            >
              <Text style={styles.modalText}>Select</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleDelete(currentItem)}
            >
              <Text style={[styles.modalText, { color: "#e74c3c" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default AddressListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: "#007BFF",
    borderWidth: 2,
    backgroundColor: "#e6f0ff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  label: { fontWeight: "600", fontSize: 16, color: "#333" },
  addressText: { fontSize: 14, color: "#555", marginLeft: 34, marginTop: 2 },
  empty: { textAlign: "center", marginTop: 50, color: "#888", fontSize: 16 },
  addBtn: {
    backgroundColor: "#007BFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  menuBtn: { paddingHorizontal: 10 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: 220,
    paddingVertical: 10,
    alignItems: "stretch",
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  modalText: { fontSize: 16, fontWeight: "600", color: "#333" },
});
