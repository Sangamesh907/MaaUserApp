// screens/ChefProfileScreen.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import api, { BASE_URL } from "../services/api";


const COLORS = {
  primary: "#00A99D",
  white: "#FFFFFF",
  black: "#333333",
  lightGray: "#F7F8FA",
  gray: "#888888",
  blue: "#448AFF",
};

const offerCards = [
  {
    title: "Andhra Style",
    code: "AND50",
    discount: "50%",
    expiry: "5th April",
    color: "#FEC107",
    image: require("../assets/dosa.png"),
  },
  {
    title: "Karnataka Style",
    code: "KAR50",
    discount: "50%",
    expiry: "5th April",
    color: "#2DBA7A",
    image: require("../assets/karnataka_style.jpg"),
  },
  {
    title: "Bengali Style",
    code: "BEN50",
    discount: "50%",
    expiry: "5th April",
    color: "#6A1B9A",
    image: require("../assets/west_bengal_style.jpg"),
  },
];

export default function ChefProfileScreen() {
  const [selectedTab, setSelectedTab] = useState("Dishes");
  const [isVeg, setIsVeg] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [aboutText, setAboutText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();
  const chef = route.params?.chef || {};

  const { cartItems, addItem, increaseItem, decreaseItem } = useContext(CartContext);


  // Fetch dishes
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/food/by-chef/${chef._id}`);
        if (data.status === "success") {
          const allDishes = Object.values(data.items)
            .flat()
            .map((item) => ({
              ...item,
              image: BASE_URL + item.photo_url,
              name: item.food_name,
            }));
          setDishes(allDishes);
        } else setDishes([]);
      } catch (err) {
        console.log("Error fetching dishes:", err);
        setDishes([]);
      } finally {
        setLoadingDishes(false);
      }
    };

    if (chef._id) fetchDishes();
  }, [chef._id]);

  // Fetch about
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/chef/about/${chef._id}`);
        if (data.status === "success") setAboutText(data.about || "");
      } catch (err) {
        console.log("Error fetching about:", err);
      }
    };
    if (chef._id) fetchAbout();
  }, [chef._id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/chef/${chef._id}/reviews`);
        if (data.status === "success") setReviews(data.reviews || []);
      } catch (err) {
        console.log("Error fetching reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    if (chef._id) fetchReviews();
  }, [chef._id]);

  // Render each dish with +/- buttons
  const renderDishItem = (item, idx) => {
    const uniqueId = item._id + "-" + chef._id; // unique per chef + dish
    const existingItem = cartItems.find((i) => i.id === uniqueId);
    const quantity = existingItem ? existingItem.quantity : 0;

    return (
      <View key={uniqueId + "-" + idx} style={styles.dishCard}>
        <Image
          source={item.image ? { uri: item.image } : require("../assets/dosa.png")}
          style={styles.dishImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.dishTitle}>{item.name}</Text>
          <Text style={styles.dishDelivery}>{item.service_type || "Delivery in 30 mins"}</Text>
          <View style={{ flexDirection: "row", marginTop: 4, alignItems: "center" }}>
            <View style={styles.ratingBoxGreen}>
              <Text style={styles.ratingText}>★ {item.rating || 4.5}</Text>
            </View>
            <Text style={styles.reviewText}>{item.quantity || 1} Available</Text>
          </View>
        </View>

        <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
          <Text style={styles.dishPrice}>₹{item.price}</Text>

          {/* Quantity Buttons */}
          {quantity > 0 ? (
            <View style={styles.quantityRow}>
              <TouchableOpacity onPress={() => decreaseItem(uniqueId)} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyNumber}>{quantity}</Text>
              <TouchableOpacity onPress={() => increaseItem(uniqueId)} style={styles.qtyBtn}>
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                addItem({
                  _id: item._id,
                  id: uniqueId, // unique
                  name: item.name,
                  price: item.price,
                  chef_id: chef._id,
                  food_id: item._id,
                })
              }
            >
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    switch (selectedTab) {
      case "Dishes":
        return loadingDishes ? (
          <Text>Loading dishes...</Text>
        ) : dishes.length === 0 ? (
          <Text>No dishes available.</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>All Dishes</Text>
            {dishes.map((dish, idx) => renderDishItem(dish, idx))}
          </>
        );

      case "About":
        return (
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>{aboutText || "Chef bio not available."}</Text>
          </View>
        );

      case "Offers":
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {offerCards.map((offer, idx) => (
              <View key={offer.title + "-" + idx} style={[styles.offerCardHorizontal, { backgroundColor: offer.color }]}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <TouchableOpacity style={styles.codeBtn}>
                    <Text style={styles.codeText}>Use Code</Text>
                  </TouchableOpacity>
                  <Text style={styles.offerDiscount}>Get Upto {offer.discount} Off</Text>
                  <Text style={styles.offerExpiry}>Valid Until: {offer.expiry}</Text>
                </View>
                <Image source={offer.image} style={styles.offerImageHorizontal} />
              </View>
            ))}
          </ScrollView>
        );

      case "Reviews":
        return loadingReviews ? (
          <Text>Loading reviews...</Text>
        ) : reviews.length === 0 ? (
          <Text>No reviews available.</Text>
        ) : (
          reviews.map((rev, idx) => (
            <View key={(rev._id || idx) + "-review"} style={styles.reviewCard}>
              <Text style={{ fontWeight: "bold" }}>Taste: {rev.taste_rating}/5</Text>
              <Text style={{ fontWeight: "bold" }}>Portion: {rev.portion_rating}/5</Text>
              <Text style={{ marginTop: 4 }}>{rev.review_text}</Text>
              <Text style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>
                {new Date(rev.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={require("../assets/food-banner.jpg")}
          style={{ width: "100%", height: 200 }}
        />

        <View style={styles.chefInfoBox}>
          <Text style={styles.chefName}>{chef.name || "Unnamed Chef"}</Text>
          <Text style={styles.chefLocation}>{chef.style || "Home Chef"}</Text>

          <View style={styles.chefRatingRow}>
            <View style={styles.ratingBoxGreen}>
              <Text style={styles.ratingText}>★ 4.5</Text>
            </View>
            <Text style={styles.reviewTextBlue}>40 Reviews</Text>
          </View>

          <View style={styles.chefBottomRow}>
            <Ionicons name="location-outline" size={16} color={COLORS.blue} />
            <Text style={styles.chefArea}>
              📍{" "}
              {chef.location?.coordinates
                ? `${chef.location.coordinates[1]}, ${chef.location.coordinates[0]}`
                : "Location not available"}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 16 }}>
              <Text style={{ marginRight: 8 }}>Veg</Text>
              <Switch value={isVeg} onValueChange={() => setIsVeg(!isVeg)} />
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {["Dishes", "About", "Offers", "Reviews"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ padding: 16 }}>{renderTabContent()}</View>
      </ScrollView>

      <TouchableOpacity
        style={styles.viewCartButton}
        onPress={() => navigation.navigate("Main", { screen: "Cart" })}
      >
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.cartText}>View Cart</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  chefInfoBox: { padding: 16, backgroundColor: COLORS.white },
  chefName: { fontSize: 22, fontWeight: "bold", color: COLORS.black },
  chefLocation: { fontSize: 16, color: COLORS.gray, marginTop: 4 },
  chefRatingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  chefBottomRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  chefArea: { marginLeft: 4, fontSize: 14, color: COLORS.blue },
  ratingBoxGreen: {
    backgroundColor: "#28a745",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  reviewText: { color: COLORS.gray, fontSize: 13 },
  reviewTextBlue: { color: COLORS.blue, fontSize: 13 },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  tabText: { fontSize: 16, color: COLORS.gray },
  activeTabText: { color: COLORS.black, fontWeight: "bold" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.black, marginVertical: 12 },
  aboutBox: { backgroundColor: COLORS.white, padding: 16, borderRadius: 8, elevation: 1 },
  aboutText: { fontSize: 14, color: COLORS.black, lineHeight: 20 },
  dishCard: { backgroundColor: COLORS.white, flexDirection: "row", borderRadius: 10, padding: 12, alignItems: "center" },
  dishImage: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  dishTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.black },
  dishDelivery: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  dishPrice: { fontSize: 16, fontWeight: "bold", color: COLORS.black },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, marginTop: 6 },
  addText: { color: COLORS.white, fontWeight: "bold" },
  viewCartButton: { flexDirection: "row", backgroundColor: COLORS.primary, padding: 12, justifyContent: "center", alignItems: "center" },
  cartText: { color: COLORS.white, marginLeft: 8, fontSize: 16 },
  offerCardHorizontal: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    width: 250,
  },
  offerTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.white },
  codeBtn: { backgroundColor: COLORS.white, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6, marginTop: 6, alignSelf: "flex-start" },
  codeText: { color: COLORS.black, fontWeight: "bold", fontSize: 12 },
  offerDiscount: { color: COLORS.white, marginTop: 6, fontSize: 14 },
  offerExpiry: { color: COLORS.white, fontSize: 12, marginTop: 2 },
  offerImageHorizontal: { width: 60, height: 60, borderRadius: 8 },
  reviewCard: { backgroundColor: COLORS.white, padding: 12, marginBottom: 10, borderRadius: 8 },

  // Quantity Buttons
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  qtyBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qtyText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  qtyNumber: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
