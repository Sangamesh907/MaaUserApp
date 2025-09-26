// screens/ChefDetailScreen.js
import React from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, FlatList
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const COLORS = {
  primary: '#00A99D',
  white: '#FFFFFF',
  black: '#333',
  gray: '#888',
  lightGray: '#F7F8FA',
};

const ChefDetailScreen = ({ route, navigation }) => {
  const { chef } = route.params;

  // Dummy offers list
  const offers = [
    { id: '1', title: 'Special Biryani', price: '₹199' },
    { id: '2', title: 'Homemade Thali', price: '₹149' },
    { id: '3', title: 'Veg Curry Combo', price: '₹99' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chef.name}'s Offers</Text>
        <View style={{ width: 26 }} /> {/* Placeholder to center title */}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: chef.image }} style={styles.image} />
        <Text style={styles.name}>{chef.name}</Text>
        <Text style={styles.style}>{chef.style}</Text>
        <Text style={styles.offers}>Total Offers: {chef.offers}</Text>
        <Text style={styles.bio}>
          Chef {chef.name} specializes in {chef.style}. Enjoy exclusive discounts and homely meals made with love!
        </Text>

        {/* Offers List */}
        <Text style={styles.sectionTitle}>Popular Dishes</Text>
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.offerCard}>
              <Text style={styles.offerText}>{item.title}</Text>
              <Text style={styles.offerPrice}>{item.price}</Text>
            </View>
          )}
        />
      </ScrollView>

      {/* Order Button */}
      <TouchableOpacity style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Order Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    elevation: 4, // shadow for Android
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  container: { padding: 20, alignItems: 'center', paddingBottom: 100 },
  image: {
    width: 150, height: 150, borderRadius: 75, marginBottom: 16,
    borderWidth: 3, borderColor: COLORS.primary, elevation: 5,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  style: { fontSize: 16, color: COLORS.gray, marginVertical: 4 },
  offers: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  bio: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  offerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginVertical: 6,
    width: '100%',
  },
  offerText: { fontSize: 16, color: COLORS.black },
  offerPrice: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  orderButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonText: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

export default ChefDetailScreen;
