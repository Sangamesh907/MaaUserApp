// screens/ExploreChefsScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../services/api";

export default function ExploreChefsScreen() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchChefs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/chefs/nearby"); // ✅ interceptor adds token
      console.log("✅ Chefs API response:", response.data);

      if (response.data?.status === "success") {
        setChefs(response.data.chefs || []);
      } else {
        console.warn("⚠️ Unexpected response:", response.data);
        Alert.alert("Error", "Unexpected API response.");
      }
    } catch (error) {
      console.error("❌ Error fetching chefs:", error.response?.data || error);

      if (error.response?.status === 401) {
        Alert.alert("Session expired", "Please log in again.");
        // Optional: navigation.navigate("Login");
      } else {
        Alert.alert("Error", "Unable to fetch nearby chefs.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChefs();
  }, [fetchChefs]);

  const renderChef = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("ChefProfile", {
          chef: item, // pass full object
        })
      }
    >
      {/* Placeholder image since API has no image field */}
      <View style={styles.imagePlaceholder}>
        <Text style={styles.initials}>{item.name?.charAt(0) || "?"}</Text>
      </View>

      <Text style={styles.name}>{item.name || "Unnamed Chef"}</Text>

      {item.location?.coordinates && (
        <Text style={styles.coords}>
          📍 Lat: {item.location.coordinates[1]} | Lng: {item.location.coordinates[0]}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && chefs.length === 0 ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={chefs}
          keyExtractor={(item) => item._id}
          renderItem={renderChef}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchChefs} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No chefs available nearby.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  card: {
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: { fontSize: 42, fontWeight: "bold", color: "#555" },
  name: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  coords: { fontSize: 13, color: "#666", marginTop: 4 },
});
