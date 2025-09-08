import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Color constants based on the image
const COLORS = {
  primary: '#00A99D',
  white: '#FFFFFF',
  black: '#333333',
  gray: '#888888',
  lightGray: '#F7F8FA', // Main background for the scroll area
  yellow: '#FFC107',
  green: '#28a745',
  purple: '#6f42c1',
};

// Mock data for the coupon cards
const offersData = [
  {
    title: "Andhra Style",
    code: "AND50",
    discount: "Get Upto 50% Off",
    validUntil: "Offer Valid Until : 5th April",
    color: COLORS.yellow,
    image: require('../assets/dosa.png'), // Make sure to have this image in ./assets/
  },
  {
    title: "Karnataka Style",
    code: "KNT50",
    discount: "Get Upto 50% Off",
    validUntil: "Offer Valid Until : 5th April",
    color: COLORS.green,
    image: require('../assets/curry.png'), // Make sure to have this image in ./assets/
  },
  {
    title: "Bengali Style",
    code: "BEN50",
    discount: "Get Upto 50% Off",
    validUntil: "Offer Valid Until : 5th April",
    color: COLORS.purple,
    image: require('../assets/idli.png'), // Make sure to have this image in ./assets/
  },
];


// --- Reusable Coupon Card Component ---
const CouponCard = ({ data }) => {
  return (
    <View style={[styles.couponContainer, { backgroundColor: data.color }]}>
      {/* These two views create the cutout effect */}
      <View style={[styles.circle, styles.leftCircle]} />
      <View style={[styles.circle, styles.rightCircle]} />

      <View style={styles.couponTopSection}>
        <View style={styles.couponTextContainer}>
          <Text style={styles.couponTitle}>{data.title}</Text>
          <Text style={styles.couponCodeBackground}>{data.code}</Text>
          <Text style={styles.couponUseCode}>Use Code</Text>
          <Text style={styles.couponDiscount}>{data.discount}</Text>
        </View>
        <Image source={data.image} style={styles.foodImage} />
      </View>
      
      <View style={styles.dashedLine} />

      <View style={styles.couponBottomSection}>
        <Text style={styles.couponValidText}>{data.validUntil}</Text>
      </View>
    </View>
  );
};

// --- Reusable Bottom Tab Bar Component ---
const BottomTabBar = () => (
    <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="home-outline" size={28} color={COLORS.gray} />
            <Text style={styles.tabLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="tag-outline" size={28} color={COLORS.primary} />
            <Text style={[styles.tabLabel, { color: COLORS.primary }]}>Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="cart-outline" size={28} color={COLORS.gray} />
            <Text style={styles.tabLabel}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
            <MaterialCommunityIcons name="account-outline" size={28} color={COLORS.gray} />
            <Text style={styles.tabLabel}>Account</Text>
        </TouchableOpacity>
    </View>
);


// --- Main Screen Component ---
const ChefOffersScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lakshmi ( Chef )</Text>
        <TouchableOpacity style={styles.headerOffer}>
          <Ionicons name="settings-outline" size={20} color={COLORS.primary} />
          <Text style={styles.headerOfferText}>5 Offers</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.description}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.
        </Text>
        
        {/* Map over offers and display them */}
        {offersData.map((offer, index) => (
          <CouponCard key={index} data={offer} />
        ))}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  headerOffer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerOfferText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 5,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORS.lightGray,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 21,
  },
  // Coupon Card Styles
  couponContainer: {
    borderRadius: 15,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden', // IMPORTANT: This is key for the cutout effect
  },
  couponTopSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  couponTextContainer: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  couponCodeBackground: {
    position: 'absolute',
    top: 20,
    left: 0,
    fontSize: 60,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.2)', // Semi-transparent text
    letterSpacing: 2,
    zIndex: -1,
  },
  couponUseCode: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: 8,
  },
  couponDiscount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 4,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    position: 'relative',
    right: -35, // Pushes the image slightly outside the card
  },
  dashedLine: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 20,
  },
  couponBottomSection: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  couponValidText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  // Circle cutout styles
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.lightGray, // Must match the screen's background
    position: 'absolute',
    top: '50%',
    marginTop: -28, // Adjust this value to vertically center the circle on the dashed line
  },
  leftCircle: {
    left: -15, // Half of the circle's width to push it outside
  },
  rightCircle: {
    right: -15, // Half of the circle's width to push it outside
  },
  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    height: 65,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    backgroundColor: COLORS.white,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    color: COLORS.gray,
    marginTop: 2,
  },
});

export default ChefOffersScreen;