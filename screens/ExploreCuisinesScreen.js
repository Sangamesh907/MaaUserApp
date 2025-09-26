import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const cuisines = [ 
  { name: 'Andhra Style', image: require('../assets/andhra_style.jpg') },
    { name: 'Arunachal Pradesh Style', image: require('../assets/arunachal_pradesh_style.jpg') },
    { name: 'Assam Style', image: require('../assets/assam_style.jpg') },
    { name: 'Bihar Style', image: require('../assets/bihar_style.jpg') },
    { name: 'Chattisgarh Style', image: require('../assets/chattisgarh_style.jpg') },
    { name: 'Delhi Style', image: require('../assets/delhi_style.jpg') },
    { name: 'Goa Style', image: require('../assets/goa_style.jpg') },
    { name: 'Gujarat Style', image: require('../assets/gujarat_style.jpg') },
    { name: 'Haryana Style', image: require('../assets/haryana_style.jpg') },
    { name: 'Himachal Pradesh Style', image: require('../assets/himachal_pradesh_style.jpg') },
    { name: 'Jammu Kashmir Style', image: require('../assets/jammu_kashmir_style.jpg') },
    { name: 'Jharkhand Style', image: require('../assets/jharkhand_style.jpg') },
    { name: 'Karnataka Style', image: require('../assets/karnataka_style.jpg') },
    { name: 'Kerala Style', image: require('../assets/kerala_style.jpg') },
    { name: 'Madhya Pradesh Style', image: require('../assets/madhya_pradesh_style.jpg') },
    { name: 'Maharastrian Style', image: require('../assets/maharastrian_style.jpg') },
    { name: 'Meghalaya Style', image: require('../assets/meghalaya_style.jpg') },
    { name: 'Mizoram Style', image: require('../assets/mizoram_style.jpg') },
    { name: 'Nagaland Style', image: require('../assets/nagaland_style.jpg') },
    { name: 'Orissa Style', image: require('../assets/orissa_style.jpg') },
    { name: 'Punjabi Style', image: require('../assets/punjabi_style.jpg') },
    { name: 'Rajasthan Style', image: require('../assets/rajasthan_style.jpg') },
    { name: 'Sikkim Style', image: require('../assets/sikkim_style.jpg') },
    { name: 'Tamilian Style', image: require('../assets/tamilian_style.jpg') },
    { name: 'Telangana Style', image: require('../assets/telangana_style.jpg') },
    { name: 'Tripura Style', image: require('../assets/tripura_style.jpg') },
    { name: 'Uttrakhand Style', image: require('../assets/uttrakhand_style.jpg') },
    { name: 'Uttar Pradesh Style', image: require('../assets/uttar_pradesh_style.jpg') },
    { name: 'West Bengal Style', image: require('../assets/west_bengal_style.jpg') },
  ];


    


export default function ExploreCuisinesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore Cuisines</Text>
      <FlatList
        data={cuisines}
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
