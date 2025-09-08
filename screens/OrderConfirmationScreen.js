// OrderConfirmationScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function OrderConfirmationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../assets/bowl1.png')} // Replace with your image path
          style={styles.bowlImage}
        />
        <Text style={styles.thankYou}>Thank You</Text>
        <Text style={styles.subText}>You have successfully placed your Order</Text>
      </View>

      <View style={styles.card}>
        <Image
          source={require('../assets/dosa.jpg')} // Replace with your item image
          style={styles.foodImage}
        />
        <Text style={styles.chefName}>Lakshmi ( Chef )</Text>
        <Text style={styles.item}>Item : Dosa</Text>
        <Text style={styles.subscription}>Subscription : Weekly Package</Text>
        <Text style={styles.orderNo}>Order No : <Text style={{ color: '#00A36C' }}>110040717</Text></Text>
       <TouchableOpacity
         style={styles.trackButton}
         onPress={() => navigation.navigate('OrderDelivered')}
         >
       <Text style={styles.trackText}>📍 Track Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3f7ffb' },
  topSection: { alignItems: 'center', marginTop: 50 },
  bowlImage: { width: 370, height: 220, resizeMode: 'contain' },
  thankYou: { fontSize: 22, fontWeight: 'bold', color: 'white', marginTop: 20 },
  subText: { color: 'white', marginTop: 5 },
  card: {
    flex: 1,
    marginTop: 40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    padding: 20,
  },
  foodImage: { width: 100, height: 100, borderRadius: 10, marginBottom: 10 },
  chefName: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  item: { fontSize: 16, marginTop: 5 },
  subscription: { fontSize: 14, color: '#4A90E2', marginTop: 5 },
  orderNo: { fontSize: 14, marginTop: 5 },
  trackButton: {
    backgroundColor: '#3f7ffb',
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  trackText: { color: 'white', fontWeight: 'bold' },
});
