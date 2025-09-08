import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useRoute } from '@react-navigation/native';

const FoodItemCard = () => (
  <View style={styles.cardContainer}>
    <Image source={require('../assets/food_vada.png')} style={styles.cardImage} />

    <View style={styles.discountBadge}>
      <Text style={styles.discountText}>50% off</Text>
    </View>
    <View style={styles.discountBadgeTriangle} />

    <View style={styles.cardContent}>
      <View style={styles.cardHeader}>
        <Image source={require('../assets/chef_avatar.png')} style={styles.avatar} />
        <View style={styles.chefInfo}>
          <Text style={styles.chefName}>Sangamesh pailwan - Chef</Text>
          <View style={styles.chefLocation}>
            <Icon name="location-pin" size={14} color="#9E9E9E" />
            <Text style={styles.locationText}>Hyderabad</Text>
          </View>
        </View>
      </View>

      <Text style={styles.deliveryTime}>Delivery in 32 mins</Text>

      <View style={styles.cardFooter}>
        <View style={styles.tagsContainer}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>50 Orders Supplied</Text>
          </View>
          <View style={[styles.tag, styles.ratingTag]}>
            <Icon name="star" size={14} color="#FFFFFF" />
            <Text style={[styles.tagText, { color: '#FFFFFF', marginLeft: 4 }]}>4.5</Text>
          </View>
          <Text style={styles.reviewsText}>4 Reviews</Text>
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const FoodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const selectedMeal = route.params?.selectedMeal || 'Breakfast';
  const [activeTab, setActiveTab] = useState(selectedMeal);

  const tabs = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.infoSection}>
            <Text style={styles.title}>{activeTab} - Andhra Style</Text>
            <View style={styles.locationContainer}>
              <Icon name="location-pin" size={16} color="#757575" />
              <Text style={styles.locationTitle}>HSR Layout</Text>
            </View>
            <Text style={styles.description}>
              Enjoy homemade Andhra food delivered to your doorstep by passionate chefs.
            </Text>
          </View>

          <View style={styles.dottedDividerContainer}>
            {Array.from({ length: 40 }).map((_, i) => <View key={i} style={styles.dot} />)}
          </View>

          <View style={styles.tabBar}>
            {tabs.map(tab => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                {activeTab === tab && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Filtered Food List - replace with filtered data if needed */}
          <FoodItemCard />
          <FoodItemCard />
          <FoodItemCard />
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="options" size={24} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4CAF50" />
          <Text style={[styles.navText, { color: '#4CAF50' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="percentage" size={22} color="#9E9E9E" />
          <Text style={styles.navText}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="cart-outline" size={26} color="#9E9E9E" />
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#9E9E9E" />
          <Text style={styles.navText}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FoodScreen;

// --- Styles (same as before) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 5 },
  container: { paddingHorizontal: 16 },
  infoSection: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationTitle: { fontSize: 14, color: '#757575', marginLeft: 4 },
  description: { fontSize: 14, color: '#616161', marginTop: 12, lineHeight: 20 },
  dottedDividerContainer: { flexDirection: 'row', overflow: 'hidden', height: 1, marginBottom: 20 },
  dot: { width: 4, height: 1, backgroundColor: '#BDBDBD', marginRight: 4 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  tabText: { fontSize: 16, color: '#9E9E9E', fontWeight: '500', paddingBottom: 8 },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  activeTabIndicator: { height: 3, backgroundColor: '#000', borderRadius: 2 },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: { width: '100%', height: 150, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#FFF' },
  chefInfo: { marginLeft: 12 },
  chefName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  chefLocation: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locationText: { fontSize: 12, color: '#9E9E9E', marginLeft: 2 },
  discountBadge: {
    position: 'absolute',
    top: 130,
    right: 0,
    backgroundColor: '#FFC107',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  discountBadgeTriangle: {
    position: 'absolute',
    top: 130,
    right: -10,
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderBottomWidth: 15,
    borderBottomColor: '#b38600',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    transform: [{ translateY: 15 }],
  },
  discountText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
  deliveryTime: { fontSize: 14, color: '#616161', marginTop: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  tagsContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  ratingTag: { backgroundColor: '#4CAF50', flexDirection: 'row', alignItems: 'center' },
  tagText: { color: '#1E88E5', fontWeight: '600', fontSize: 12 },
  reviewsText: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  viewButton: { backgroundColor: '#E8F5E9', paddingHorizontal: 24, paddingVertical: 8, borderRadius: 20 },
  viewButtonText: { color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#1E88E5',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
    paddingBottom: 5,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, color: '#9E9E9E', marginTop: 2 },
});
