import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const chefs = [
  { name: 'Lakshmi', style: 'Andhra Style', image: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'Meena', style: 'Karnataka Style', image: 'https://randomuser.me/api/portraits/women/2.jpg' },
  { name: 'Radha', style: 'Punjabi Style', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { name: 'Anita', style: 'Rajasthani Style', image: 'https://randomuser.me/api/portraits/women/4.jpg' }, // ✅ updated from Gujarati
];

export default function ExploreChefsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Chefs</Text>
      <FlatList
        data={chefs}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.style}>{item.style}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'fff' },
  title: { fontSize: 18, fontWeight: 'bold', margin: 16 },
  card: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 40 },
  name: { marginTop: 8, fontWeight: 'bold', fontSize: 14 },
  style: { fontSize: 12, color: '#666' },
});
