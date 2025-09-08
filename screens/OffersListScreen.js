// screens/OffersListScreen.js
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FilterModal from '../components/FilterModal';

const COLORS = {
  primary: '#00A99D',
  lightPrimary: '#E6F6F5',
  white: '#FFFFFF',
  black: '#333',
  gray: '#888',
  lightGray: '#F7F8FA',
  blue: '#4A90E2',
};

const chefsData = [
  { id: '1', name: 'Lakshmi', style: 'Andhra | Karnataka Style', offers: 8, image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '2', name: 'Meena', style: 'Punjabi Style', offers: 5, image: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { id: '3', name: 'Radha', style: 'Gujarati Style', offers: 6, image: 'https://randomuser.me/api/portraits/men/46.jpg' },
];

const OffersListScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const ChefCard = ({ item }) => (
    <View style={styles.card}>
      {/* Tap on image/profile area → Navigate to Profile */}
      <TouchableOpacity
        onPress={() => navigation.navigate('ChefProfile', { chef: item })}
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
      >
        <Image source={{ uri: item.image }} style={styles.profileImage} />
        <View style={styles.cardInfo}>
          <Text style={styles.chefName}>{item.name}</Text>
          <Text style={styles.chefStyle}>{item.style}</Text>
          <View style={styles.offerInfo}>
            <MaterialCommunityIcons name="brightness-percent" size={16} color={COLORS.primary} />
            <Text style={styles.offerText}>{item.offers} Offers</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Tap on this button → Navigate to Offers */}
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('ChefOffers', { chef: item })}
      >
        <Text style={styles.viewButtonText}>View Offers</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.lightGray} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Offers from Chefs</Text>
        <TouchableOpacity>
          <Feather name="search" size={26} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Find exciting discounts from your favorite chefs!
      </Text>

      <FlatList
        data={chefsData}
        renderItem={({ item }) => <ChefCard item={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="filter-variant" size={30} color={COLORS.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <FilterModal onClose={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.lightGray },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    padding: 16, backgroundColor: COLORS.white, alignItems: 'center'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.black },
  description: { fontSize: 14, color: COLORS.gray, paddingHorizontal: 20, paddingVertical: 10 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 80 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white,
    padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center'
  },
  profileImage: { width: 60, height: 60, borderRadius: 30 },
  cardInfo: { flex: 1, marginLeft: 12 },
  chefName: { fontSize: 18, fontWeight: 'bold' },
  chefStyle: { fontSize: 14, color: COLORS.gray },
  offerInfo: { flexDirection: 'row', alignItems: 'center' },
  offerText: { marginLeft: 6, color: COLORS.primary, fontWeight: '600' },
  viewButton: {
    backgroundColor: COLORS.lightPrimary, paddingVertical: 6,
    paddingHorizontal: 12, borderRadius: 20,
  },
  viewButtonText: { color: COLORS.primary, fontWeight: 'bold' },
  fab: {
    position: 'absolute', bottom: 20, right: 20,
    backgroundColor: COLORS.blue, width: 60, height: 60,
    justifyContent: 'center', alignItems: 'center', borderRadius: 30,
  },
});

export default OffersListScreen;
