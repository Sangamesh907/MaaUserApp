// screens/ChefDetailScreen.js
import React from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={26} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chef.name}'s offers</Text>
        <View style={{ width: 26 }} /> {/* Placeholder to center title */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: chef.image }} style={styles.image} />
        <Text style={styles.name}>{chef.name}</Text>
        <Text style={styles.style}>{chef.style}</Text>
        <Text style={styles.offers}>Total Offers: {chef.offers}</Text>
        <Text style={styles.bio}>Chef {chef.name} specializes in {chef.style}. Enjoy exclusive discounts and homely meals made with love!</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', backgroundColor: COLORS.white
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.black },
  container: { padding: 20, alignItems: 'center' },
  image: { width: 150, height: 150, borderRadius: 75, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.black },
  style: { fontSize: 16, color: COLORS.gray, marginVertical: 4 },
  offers: { fontSize: 16, fontWeight: '600', color: COLORS.primary },
  bio: { fontSize: 14, color: COLORS.black, marginTop: 10, textAlign: 'center' },
});

export default ChefDetailScreen;
