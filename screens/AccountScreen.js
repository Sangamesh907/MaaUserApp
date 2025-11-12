// screens/AccountScreen.js
import React, { useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import api, { BASE_URL } from "../services/api"; // ✅ centralized API
import { AuthContext } from "../context/AuthContext";

const COLORS = {
  primary: "#00A99D",
  lightPrimary: "#E0F2F1",
  white: "#FFFFFF",
  black: "#333333",
  lightGray: "#F7F8FA",
  gray: "#888888",
  border: "#E0E0E0",
};

const AccountScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    imageUri: "",
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await api.get("/userme");
      console.log("📤 GET /userme response:", response.data);

      if (response.status === 200 && response.data) {
        const data = response.data;
        setProfile({
          name: data.name || "",
          email: (data.email || "").replace(/\s+/g, ""),
          phone: data.phone_number || "",
          imageUri: data.photo_url ? `${BASE_URL}${data.photo_url}` : "",
        });
      }
    } catch (error) {
      console.log("❌ GET /userme error:", error.response || error.message);
      Alert.alert("Error", "Failed to fetch profile. Try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: <MaterialIcons name="leaderboard" size={24} color={COLORS.primary} />,
      text: "Order History",
      onPress: () => navigation.navigate("OrderHistory"),
    },
    {
      icon: <Ionicons name="location-sharp" size={24} color={COLORS.primary} />,
      text: "Addresses",
      onPress: () => navigation.navigate("AddAddress"),
    },
    {
      icon: (
        <View style={styles.iconContainer}>
          <FontAwesome name="rupee" size={16} color={COLORS.primary} />
        </View>
      ),
      text: "Payment",
      onPress: () => navigation.navigate("Payment"),
    },
    {
      icon: <MaterialIcons name="headset-mic" size={24} color={COLORS.primary} />,
      text: "Customer Support",
      onPress: () => navigation.navigate("CustomerSupport"),
    },
    {
      icon: <MaterialCommunityIcons name="chat-question" size={24} color={COLORS.primary} />,
      text: "FAQ's",
      onPress: () => navigation.navigate("FAQ"),
    },
    {
      icon: <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />,
      text: "Terms and Conditions",
      onPress: () => navigation.navigate("TermsAndConditions"),
    },
    {
      icon: <MaterialCommunityIcons name="shield-lock-outline" size={24} color={COLORS.primary} />,
      text: "Privacy Policy",
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchProfile(); }} />}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={profile.imageUri ? { uri: profile.imageUri } : require("../assets/default-user.png")}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileDetail}>{profile.email}</Text>
            <Text style={styles.profileDetail}>{profile.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Icon name="edit-2" size={16} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemContent}>{item.icon}<Text style={styles.menuItemText}>{item.text}</Text></View>
              <Icon name="chevron-right" size={22} color={COLORS.gray} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>LOGOUT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  contentContainer: { paddingBottom: 20 },
  profileHeader: { flexDirection: "row", alignItems: "center", padding: 20 },
  profileImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#ddd" },
  profileInfo: { flex: 1, marginLeft: 20 },
  profileName: { fontSize: 20, fontWeight: "bold", color: COLORS.black },
  profileDetail: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  editButton: { alignItems: "center", justifyContent: "center" },
  editButtonText: { color: COLORS.primary, fontSize: 12, marginTop: 4 },
  menuSection: { marginTop: 20, marginHorizontal: 16 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuItemContent: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightPrimary,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: { marginLeft: 16, fontSize: 16, color: COLORS.black, fontWeight: "500" },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: COLORS.lightPrimary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  logoutButtonText: { color: COLORS.primary, fontSize: 16, fontWeight: "bold" },
});

export default AccountScreen;
