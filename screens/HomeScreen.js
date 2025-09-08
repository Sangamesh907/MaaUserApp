// screens/HomeScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import FilterComponent from './FilterComponent';
import { LocationContext } from '../context/LocationContext';

// Google Maps API Key
const GOOGLE_API_KEY = "AIzaSyCzwrbeXIlDLSts1tx4GKT5RqIm505Ne0M";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { location, setLocation, address, setAddress } = useContext(LocationContext);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const chefs = [
    { name: 'Lakshmi', style: 'Andhra Style' },
    { name: 'Meena', style: 'Karnataka Style' },
    { name: 'Radha', style: 'Punjabi Style' },
    { name: 'Anita', style: 'Rajasthani Style' },
  ];

  const cuisines = [
    { name: 'Andhra Style', image: require('../assets/andhra.png') },
    { name: 'Karnataka Style', image: require('../assets/karnataka.png') },
    { name: 'Punjabi Style', image: require('../assets/punjabi.png') },
  ];

  // Request location permission (Android only)
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true; // iOS handled via Info.plist
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Fetch current location + reverse geocode
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Cannot access location');
      return;
    }

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });

        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
          );

          if (response.data.status === "OK" && response.data.results.length > 0) {
            setAddress(response.data.results[0].formatted_address);
          } else {
            setAddress("Unknown Location");
          }
        } catch (error) {
          console.log("Geocoding error:", error.message);
          setAddress("Unknown Location");
        }
      },
      (error) => {
        console.log('Location error:', error.message);
        Alert.alert('Error', 'Unable to fetch location');
        setAddress("Unknown Location");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Location and Search */}
        <View style={styles.header}>
          <Text style={styles.locationTitle}>📍 Home</Text>
          <Text style={styles.address}>
            {address
              ? address
              : location
              ? `Lat: ${location.latitude.toFixed(4)}, Lon: ${location.longitude.toFixed(4)}`
              : 'Fetching your location...'}
          </Text>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#555" />
            <TextInput placeholder="Search" style={styles.input} />
            <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
              <Ionicons name="filter" size={20} color="#555" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Offers Section */}
        <View style={styles.offerRow}>
          <TouchableOpacity
            style={styles.offerCardYellow}
            onPress={() =>
              navigation.navigate('Offers', {
                screen: 'OffersList',
                params: { style: 'Andhra Style' },
              })
            }
          >
            <Text style={styles.offerTitle}>Andhra Style</Text>
            <Text style={styles.offerSubtitle}>Use Code</Text>
            <Text style={styles.offerPercent}>Get Upto 50% Off</Text>
            <Text style={styles.offerDate}>Offer Valid Till: 5th April</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.offerCardGreen}
            onPress={() =>
              navigation.navigate('Offers', {
                screen: 'OffersList',
                params: { style: 'Karnataka Style' },
              })
            }
          >
            <Text style={styles.offerTitle}>Karnataka Style</Text>
            <Text style={styles.offerSubtitle}>Use Code</Text>
            <Text style={styles.offerPercent}>Get Upto 50% Off</Text>
            <Text style={styles.offerDate}>Offer Valid Till: 5th April</Text>
          </TouchableOpacity>
        </View>

        {/* Food Styles */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Food Styles</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExploreFoodStyles')}>
            <Text style={styles.explore}>Explore All ➜</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.foodStyleRow}>
          {cuisines.map((item, index) => (
            <View key={index} style={styles.foodCard}>
              <Image source={item.image} style={styles.foodImage} />
              <Text style={styles.foodStyleRowText}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <View style={styles.filters}>
          <Text style={styles.filterBtn}>Filters</Text>
          <Text style={styles.filterBtn}>Sort by</Text>
          <Text style={styles.filterBtn}>Chef Rating</Text>
          <Text style={styles.filterBtn}>Veg</Text>
        </View>

        {/* Chefs around me */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Chefs around me</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExploreChefs')}>
            <Text style={styles.explore}>Explore All ➜</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chefList}>
          {chefs.map((chef, index) => (
            <View key={index} style={styles.chefCard}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
                style={styles.chefImage}
              />
              <Text style={styles.chefName}>{chef.name}</Text>
              <Text style={styles.chefStyle}>{chef.style}</Text>
              <Text style={styles.chefLocation}>📍 HSR Layout</Text>
              <Text style={styles.chefNativePlace}>Bidar</Text>
            </View>
          ))}
        </ScrollView>

        {/* Cashback Offers */}
        <View style={styles.cashbackRow}>
          <TouchableOpacity
            style={styles.cashbackCard}
            onPress={() =>
              navigation.navigate('Offers', {
                screen: 'OffersList',
                params: { style: 'Maharashtrian Style' },
              })
            }
          >
            <Text style={styles.paytm}>Paytm</Text>
            <Text>Maharashtrian Style</Text>
            <Text style={styles.cashback}>Flat ₹50 Cashback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cashbackCard}
            onPress={() =>
              navigation.navigate('Offers', {
                screen: 'OffersList',
                params: { style: 'Maharashtrian Style' },
              })
            }
          >
            <Text style={styles.paytm}>Paytm</Text>
            <Text>Maharashtrian Style</Text>
            <Text style={styles.cashback}>Flat ₹50 Cashback</Text>
          </TouchableOpacity>
        </View>

        {/* Cuisines Around Me */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Cuisines around me</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExploreFoodStyles')}>
            <Text style={styles.explore}>Explore All ➜</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.foodStyleRow}>
          {cuisines.map((item, index) => (
            <View key={index} style={styles.foodCard}>
              <Image source={item.image} style={styles.foodImage} />
              <Text style={styles.foodStyleRowText}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* Illustration */}
        <View style={styles.illustration}>
          <Image
            source={require('../assets/chef.png')}
            style={{ width: 390, height: 350, resizeMode: 'contain' }}
          />
        </View>

        <Text style={styles.footer}></Text>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={isFilterVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <FilterComponent onClose={() => setIsFilterVisible(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 16 },
  locationTitle: { fontSize: 18, fontWeight: 'bold' },
  address: { color: '#555', fontSize: 12, marginTop: 4 },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: { flex: 1, marginHorizontal: 10 },
  offerRow: { flexDirection: 'row', padding: 16 },
  offerCardYellow: {
    backgroundColor: '#FFD700',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 8,
  },
  offerCardGreen: {
    backgroundColor: '#008000',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    marginLeft: 8,
  },
  offerTitle: { fontWeight: 'bold', fontSize: 14, color: '#fff' },
  offerSubtitle: { fontSize: 10, marginTop: 4, color: '#fff' },
  offerPercent: { fontWeight: 'bold', marginTop: 4, color: '#fff' },
  offerDate: { fontSize: 10, marginTop: 4, color: '#fff' },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  explore: { fontSize: 13, color: '#0c8', fontWeight: '500' },
  foodStyleRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 10, flexWrap: 'wrap' },
  foodCard: { marginRight: 12, alignItems: 'center', marginBottom: 10, width: 100 },
  foodImage: { width: 100, height: 100, borderRadius: 10 },
  foodStyleRowText: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  filters: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, marginTop: 10 },
  filterBtn: {
    backgroundColor: '#eef',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 12,
  },
  chefList: { paddingHorizontal: 16, marginTop: 10 },
  chefCard: { marginRight: 12, alignItems: 'center', width: 100 },
  chefImage: { width: 80, height: 80, borderRadius: 40 },
  chefName: { fontWeight: 'bold', marginTop: 6 },
  chefStyle: { fontSize: 11, textAlign: 'center' },
  chefLocation: { fontSize: 12, color: '#555' },
  cashbackRow: { flexDirection: 'row', padding: 16 },
  cashbackCard: {
    backgroundColor: '#ccf5ff',
    flex: 1,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 4,
  },
  paytm: { fontWeight: 'bold', color: '#0033cc' },
  cashback: { color: '#009900', marginTop: 4 },
  illustration: { alignItems: 'center', marginTop: 30 },
  footer: { textAlign: 'center', marginVertical: 20, color: '#999', fontWeight: 'bold' },
});

export default HomeScreen;
