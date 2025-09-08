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
import { useRoute } from '@react-navigation/native'; // for accessing route params

// --- Reusable Food Item Card Component ---
const FoodItemCard = ({ imageSource }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={imageSource} style={styles.cardImage} />
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>50% off</Text>
      </View>
      <View style={styles.discountBadgeTriangle} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Image
            source={require('../assets/chef_avatar.png')}
            style={styles.avatar}
          />
          <View style={styles.chefInfo}>
            <Text style={styles.chefName}>LAKSHMI - Chef</Text>
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
              <Text
                style={[styles.tagText, { color: '#FFFFFF', marginLeft: 4 }]}>
                4.5
              </Text>
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
};

const BottomNavItem = ({
  icon,
  name,
  library: IconLibrary = Ionicons,
  isActive = false,
}) => {
  const color = isActive ? '#4CAF50' : '#9E9E9E';
  return (
    <TouchableOpacity style={styles.navItem}>
      <IconLibrary name={icon} size={24} color={color} />
      <Text style={[styles.navText, { color }]}>{name}</Text>
    </TouchableOpacity>
  );
};

const RestaurantScreenLunch = () => {
  const route = useRoute();
  const initialMeal = route.params?.selectedMeal || 'Lunch';
  const [activeTab, setActiveTab] = useState(initialMeal);
  const tabs = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.infoSection}>
            <Text style={styles.title}>Andhra Style</Text>
            <View style={styles.locationContainer}>
              <Icon name="location-pin" size={16} color="#757575" />
              <Text style={styles.locationTitle}>HSR Layout</Text>
            </View>
            <Text style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text>
          </View>

          <View style={styles.dottedDividerContainer}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>

          <View style={styles.tabBar}>
            {tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}>
                  {tab}
                </Text>
                {activeTab === tab && (
                  <View style={styles.activeTabIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <FoodItemCard imageSource={require('../assets/food_biryani.png')} />
          <FoodItemCard imageSource={require('../assets/food_biryani.png')} />
          <FoodItemCard imageSource={require('../assets/food_biryani.png')} />
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <BottomNavItem icon="home" name="Home" isActive={false} />
        <BottomNavItem
          icon="percentage"
          name="Offers"
          library={FontAwesome5}
          isActive={false}
        />
        <BottomNavItem icon="cart-outline" name="Cart" isActive={false} />
        <BottomNavItem
          icon="person-outline"
          name="Account"
          isActive={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 5 },
  container: { paddingHorizontal: 16 },
  infoSection: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationTitle: { fontSize: 14, color: '#757575', marginLeft: 4 },
  description: {
    fontSize: 14,
    color: '#616161',
    marginTop: 12,
    lineHeight: 20,
  },
  dottedDividerContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
    height: 1,
    marginBottom: 20,
  },
  dot: {
    width: 4,
    height: 1,
    backgroundColor: '#BDBDBD',
    marginRight: 4,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#9E9E9E',
    fontWeight: '500',
    paddingBottom: 8,
  },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  activeTabIndicator: {
    height: 3,
    backgroundColor: '#000',
    borderRadius: 2,
  },
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
  cardImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FFF',
  },
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
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  tagsContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  ratingTag: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: { color: '#1E88E5', fontWeight: '600', fontSize: 12 },
  reviewsText: { fontSize: 12, color: '#4CAF50', fontWeight: '600' },
  viewButton: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
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
  navText: { fontSize: 12, marginTop: 2 },
});

export default RestaurantScreenLunch;
