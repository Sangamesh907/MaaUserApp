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
import { AuthContext } from '../context/AuthContext';
import api, { BASE_URL } from "../services/api";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { location, setLocation } = useContext(LocationContext);
  const { authData } = useContext(AuthContext);

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [nearbyChefs, setNearbyChefs] = useState([]);

  const cuisines = [
    { name: 'Karnataka Style', image: require('../assets/karnataka_style.jpg') },
    { name: 'Andhra Style', image: require('../assets/andhra_style.jpg') },
    { name: 'Punjabi Style', image: require('../assets/punjabi_style.jpg') },
  ];

  const foodStyles = [
    { name: 'Karnataka Style', image: require('../assets/karnataka_style.jpg') },
    { name: 'Andhra Style', image: require('../assets/andhra_style.jpg') },
    { name: 'Punjabi Style', image: require('../assets/punjabi_style.jpg') },
  ];

  // Request location permission
  const requestLocationPermission = async () => {
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
    }
    return true;
  };

  // Get current device location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, altitude, accuracy } = position.coords;
        const newLocation = { latitude, longitude };
        setLocation(newLocation);

        if (authData?.token) {
          const updated = await updateLocationOnServer({ latitude, longitude, altitude, accuracy });
          if (updated) fetchNearbyChefs(latitude, longitude);
        }
      },
      (error) => {
        console.log('Location error:', error.message);
        Alert.alert('Location Error', 'Failed to fetch your current location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Update location on backend
  const updateLocationOnServer = async (coords) => {
    try {
      const response = await api.post(
        '/userlocation/update',
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          altitude: coords.altitude,
          accuracy: coords.accuracy,
        },
        { headers: { Authorization: `Bearer ${authData.token}` } }
      );

      if (response.data.status === 'success') {
        console.log('Location updated:', response.data.message);
        return true;
      }
    } catch (err) {
      console.log('Error updating location:', err.response?.data || err.message);
    }
    return false;
  };

  // Fetch nearby chefs
  const fetchNearbyChefs = async (latitude, longitude) => {
    if (!authData?.token) return;

    try {
      const response = await api.get(
        `/chefs/nearby?latitude=${latitude}&longitude=${longitude}`,
        { headers: { Authorization: `Bearer ${authData.token}` } }
      );

    if (response.data.status === "success") {
  const chefs = (response.data.chefs || []).map((chef) => ({
    _id: chef._id,
    name: chef.name,
    style: chef.style || "Chef",
    native_place: chef.native_place?.trim() || "Unknown",
    profile_picture: chef.photo_url
      ? `${BASE_URL}${chef.photo_url}`   // 👈 prepend base url for images
      : "https://randomuser.me/api/portraits/lego/1.jpg",
  }));
  setNearbyChefs(chefs);
} else {
  setNearbyChefs([]);
}
    } catch (error) {
      console.log('Error fetching nearby chefs:', error.response?.data || error.message);
      setNearbyChefs([]);
    }
  };

  useEffect(() => {
    if (location) fetchNearbyChefs(location.latitude, location.longitude);
  }, [location]);

  useEffect(() => {
    getCurrentLocation();
  }, [authData?.token]);

  return (
    <View style={styles.container}>
      <ScrollView nestedScrollEnabled>
        {/* Location & Search */}
        <View style={styles.header}>
          <Text style={styles.locationTitle}>📍 Home</Text>
          <Text style={styles.address}>
            {location
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

        {/* Offers */}
        <View style={styles.offerRow}>
          <TouchableOpacity style={styles.offerCardYellow}>
            <Text style={styles.offerTitle}>Andhra Style</Text>
            <Text style={styles.offerSubtitle}>Use Code</Text>
            <Text style={styles.offerPercent}>Get Upto 50% Off</Text>
            <Text style={styles.offerDate}>Offer Valid Till: 5th April</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.offerCardGreen}>
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
          {foodStyles.map((item, index) => (
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

        {/* Chefs Around Me */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Chefs around me</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ExploreChefs', { location })}>
            <Text style={styles.explore}>Explore All ➜</Text>
          </TouchableOpacity>
        </View>
        {nearbyChefs.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chefList} contentContainerStyle={{ paddingRight: 16 }}>
            {nearbyChefs.map((chef, index) => (
              <TouchableOpacity
                key={index}
                style={styles.chefCard}
                onPress={() => navigation.navigate('ChefProfile', { chef })}
              >
                <Image source={{ uri: chef.profile_picture }} style={styles.chefImage} />
                <Text style={styles.chefName}>{chef.name}</Text>
                <Text style={styles.chefStyle}>{chef.style}</Text>
                <Text style={styles.chefLocation}>📍 {chef.native_place}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={{ padding: 16, alignItems: 'center' }}>
            <Text style={{ color: '#555', fontSize: 14 }}>No chefs near you</Text>
          </View>
        )}

        {/* Cashback Offers */}
        <View style={styles.cashbackRow}>
          <TouchableOpacity style={styles.cashbackCard}>
            <Text style={styles.paytm}>Paytm</Text>
            <Text>Karnataka Style</Text>
            <Text style={styles.cashback}>Flat ₹50 Cashback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cashbackCard}>
            <Text style={styles.paytm}>Paytm</Text>
            <Text>Andhra Style</Text>
            <Text style={styles.cashback}>Flat ₹50 Cashback</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Cuisines */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Featured Cuisines</Text>
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
          <Image source={require('../assets/chef.png')} style={{ width: 390, height: 350, resizeMode: 'contain' }} />
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={isFilterVisible} animationType="slide" transparent onRequestClose={() => setIsFilterVisible(false)}>
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
  searchBox: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 10, marginTop: 12, borderRadius: 10, alignItems: 'center' },
  input: { flex: 1, marginHorizontal: 10 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  explore: { fontSize: 13, color: '#0c8', fontWeight: '500' },
  foodStyleRow: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 10, flexWrap: 'wrap' },
  foodCard: { marginRight: 12, alignItems: 'center', marginBottom: 10, width: 100 },
  foodImage: { width: 100, height: 100, borderRadius: 10 },
  foodStyleRowText: { fontSize: 11, textAlign: 'center', marginTop: 4 },
  filters: { flexDirection: 'row', justifyContent: 'space-around', padding: 12, marginTop: 10 },
  filterBtn: { backgroundColor: '#eef', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, fontSize: 12 },
  chefList: { paddingHorizontal: 16, marginTop: 10 },
  chefCard: { marginRight: 12, alignItems: 'center', width: 100 },
  chefImage: { width: 80, height: 80, borderRadius: 40 },
  chefName: { fontWeight: 'bold', marginTop: 6 },
  chefStyle: { fontSize: 11, textAlign: 'center' },
  chefLocation: { fontSize: 12, color: '#555' },
  offerRow: { flexDirection: 'row', padding: 16 },
  offerCardYellow: { backgroundColor: '#FFD700', flex: 1, borderRadius: 10, padding: 10, marginRight: 8 },
  offerCardGreen: { backgroundColor: '#008000', flex: 1, borderRadius: 10, padding: 10, marginLeft: 8 },
  offerTitle: { fontWeight: 'bold', fontSize: 14, color: '#fff' },
  offerSubtitle: { fontSize: 10, marginTop: 4, color: '#fff' },
  offerPercent: { fontWeight: 'bold', marginTop: 4, color: '#fff' },
  offerDate: { fontSize: 10, marginTop: 4, color: '#fff' },
  cashbackRow: { flexDirection: 'row', padding: 16 },
  cashbackCard: { backgroundColor: '#ccf5ff', flex: 1, borderRadius: 10, padding: 10, marginHorizontal: 4 },
  paytm: { fontWeight: 'bold', color: '#0033cc' },
  cashback: { color: '#009900', marginTop: 4 },
  illustration: { alignItems: 'center', marginTop: 30 },
});

export default HomeScreen;
