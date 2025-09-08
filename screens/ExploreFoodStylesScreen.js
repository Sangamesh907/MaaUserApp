import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const foodStyles = [
  { name: 'Andhra Style', image: require('../assets/andhra.png') },
  { name: 'Karnataka Style', image: require('../assets/karnataka.png') },
  { name: 'Punjabi Style', image: require('../assets/punjabi.png') },
  { name: 'Rajasthani Style', image: require('../assets/rajasthani.png') }, // ✅ updated
];

export default function ExploreFoodStylesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Food Styles</Text>
      <FlatList
        data={foodStyles}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
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
    padding: 10,
    elevation: 3,
  },
  image: { width: 100, height: 100, borderRadius: 10 },
  name: { marginTop: 8, fontWeight: '600' },
});
