import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#00A99D',
  white: '#FFFFFF',
  black: '#333333',
  lightGray: '#F7F8FA',
  gray: '#888888',
  blue: '#448AFF',
};

const mockDishes = Array(6).fill({
  name: 'Dosa',
  price: 60,
  reviews: 4,
  rating: 4.2,
  deliveryTime: 'Delivery in 32 mins',
  image: require('../assets/dosa.png'),
});

const offerCards = [
  {
    title: 'Andhra Style',
    code: 'AND50',
    discount: '50%',
    expiry: '5th April',
    color: '#FEC107',
    image: require('../assets/dosa.png'),
  },
  {
    title: 'Karnataka Style',
    code: 'KAR50',
    discount: '50%',
    expiry: '5th April',
    color: '#2DBA7A',
    image: require('../assets/karnataka.png'),
  },
  {
    title: 'Bengali Style',
    code: 'BEN50',
    discount: '50%',
    expiry: '5th April',
    color: '#6A1B9A',
    image: require('../assets/bengali.png'),
  },
];

export default function ChefProfileScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('Dishes');
  const [isVeg, setIsVeg] = useState(false);

  const renderDishItem = ({ item }) => (
    <View style={styles.dishCard}>
      <Image source={item.image} style={styles.dishImage} />
      <View style={{ flex: 1 }}>
        <Text style={styles.dishTitle}>{item.name}</Text>
        <Text style={styles.dishDelivery}>{item.deliveryTime}</Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          <View style={styles.ratingBoxGreen}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
          <Text style={styles.reviewText}>{item.reviews} Reviews</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
        <Text style={styles.dishPrice}>₹{item.price}</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Dishes':
        return (
          <>
            <Text style={styles.sectionTitle}>Breakfast</Text>
            {mockDishes.map((item, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                {renderDishItem({ item })}
              </View>
            ))}
            <Text style={styles.sectionTitle}>Lunch</Text>
            {mockDishes.map((item, index) => (
              <View key={`lunch-${index}`} style={{ marginBottom: 10 }}>
                {renderDishItem({ item })}
              </View>
            ))}
          </>
        );
      case 'About':
        return (
          <View style={styles.aboutBox}>
            <Text style={styles.aboutText}>
              Lakshmi is a verified home chef from Andhra with over 10 years of experience.
              She specializes in authentic Andhra, Telangana, and South Indian dishes using traditional recipes.
            </Text>
          </View>
        );
      case 'Offers':
        return (
          <View style={{ marginTop: 10 }}>
            {offerCards.map((offer, index) => (
              <View key={index} style={[styles.offerCard, { backgroundColor: offer.color }]}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <TouchableOpacity style={styles.codeBtn}>
                    <Text style={styles.codeText}>Use Code</Text>
                  </TouchableOpacity>
                  <Text style={styles.offerDiscount}>Get Upto {offer.discount} Off</Text>
                  <Text style={styles.offerExpiry}>Valid Until: {offer.expiry}</Text>
                </View>
                <Image source={offer.image} style={styles.offerImage} />
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flexGrow: 0 }}>
          <Image source={require('../assets/food-banner.jpg')} style={{ width: '100%', height: 200 }} />
          <View style={styles.chefInfoBox}>
            <Text style={styles.chefName}>Lakshmi ( Chef )</Text>
            <Text style={styles.chefLocation}>Andhra | Telangana</Text>
            <View style={styles.chefRatingRow}>
              <View style={styles.ratingBoxGreen}>
                <Text style={styles.ratingText}>★ 4.5</Text>
              </View>
              <Text style={styles.reviewTextBlue}>40 Reviews</Text>
            </View>
            <View style={styles.chefBottomRow}>
              <Ionicons name="location-outline" size={16} color={COLORS.blue} />
              <Text style={styles.chefArea}>HSR Layout</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16 }}>
                <Text style={{ marginRight: 8 }}>Veg</Text>
                <Switch value={isVeg} onValueChange={() => setIsVeg(!isVeg)} />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {['Dishes', 'About', 'Offers'].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setSelectedTab(tab)}>
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}

          {/* Reviews navigates to full page */}
          <TouchableOpacity onPress={() => navigation.navigate('Reviews')}>
            <Text style={styles.tabText}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <ScrollView style={{ padding: 16 }}>{renderTabContent()}</ScrollView>

        {/* View Cart Button */}
        <TouchableOpacity
          style={styles.viewCartButton}
          onPress={() => navigation.navigate('Main', { screen: 'Cart' })}
        >
          <Ionicons name="cart-outline" size={20} color="#fff" />
          <Text style={styles.cartText}>View Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightGray },
  chefInfoBox: { padding: 16, backgroundColor: COLORS.white },
  chefName: { fontSize: 22, fontWeight: 'bold', color: COLORS.black },
  chefLocation: { fontSize: 16, color: COLORS.gray, marginTop: 4 },
  chefRatingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  chefBottomRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  chefArea: { marginLeft: 4, fontSize: 14, color: COLORS.blue },
  ratingBoxGreen: {
    backgroundColor: '#28a745',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  ratingText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  reviewText: { color: COLORS.gray, fontSize: 13 },
  reviewTextBlue: { color: COLORS.blue, fontSize: 13 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  tabText: { fontSize: 16, color: COLORS.gray },
  activeTabText: { color: COLORS.black, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black, marginVertical: 12 },
  aboutBox: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
  },
  aboutText: { fontSize: 14, color: COLORS.black, lineHeight: 20 },
  offerCard: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  offerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  codeBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  codeText: { color: COLORS.black, fontWeight: 'bold' },
  offerDiscount: { color: COLORS.white, marginTop: 8, fontSize: 14 },
  offerExpiry: { color: COLORS.white, fontSize: 12, marginTop: 2 },
  offerImage: { width: 80, height: 80, resizeMode: 'contain' },
  dishCard: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  dishImage: { width: 70, height: 70, borderRadius: 10, marginRight: 12 },
  dishTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  dishDelivery: { fontSize: 12, color: COLORS.gray, marginTop: 2 },
  dishPrice: { fontSize: 16, fontWeight: 'bold', color: COLORS.black },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 6,
  },
  addText: { color: COLORS.white, fontWeight: 'bold' },
  viewCartButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartText: { color: COLORS.white, marginLeft: 8, fontSize: 16 },
});
