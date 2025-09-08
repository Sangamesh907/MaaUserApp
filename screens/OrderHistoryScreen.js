import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

// --- MOCK DATA ---
const currentOrdersData = [
  {
    id: 'current1',
    restaurant: 'Lakshmi - Chef',
    location: 'HSR Layout',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    items: 'Dosa x 1, Idly x 2',
    amount: 120,
    date: '9th, February at 12:05am',
    status: 'tracking',
  },
];

const pastOrdersData = [
  {
    id: 'past1',
    restaurant: 'Lakshmi - Chef',
    location: 'HSR Layout',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    items: 'Dosa x 1, Idly x 2',
    amount: 120,
    date: '8th, February at 9:15pm',
    status: 'delivered',
  },
  {
    id: 'past2',
    restaurant: 'Lakshmi - Chef',
    location: 'HSR Layout',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    items: 'Dosa x 1, Idly x 2',
    amount: 120,
    date: '7th, February at 11:45am',
    status: 'delivered',
  },
];

// --- OrderCard Component ---
const OrderCard = ({ order, navigation }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Image source={{ uri: order.avatar }} style={styles.avatar} />
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{order.restaurant}</Text>
        <Text style={styles.restaurantLocation}>{order.location}</Text>
      </View>
      <TouchableOpacity style={styles.helpButton}>
        <Feather name="headphones" size={22} color="#4CAF50" />
        <Text style={styles.helpText}>Help</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.cardBody}>
      <View>
        <Text style={styles.detailLabel}>Items</Text>
        <Text style={styles.detailValue}>{order.items}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.detailLabel}>Amount</Text>
        <Text style={styles.detailValue}>₹ {order.amount}</Text>
      </View>
    </View>

    <Text style={styles.orderedOn}>Ordered On</Text>
    <Text style={styles.date}>{order.date}</Text>

    <View style={styles.cardFooter}>
      {order.status === 'tracking' ? (
        <TouchableOpacity
          style={[styles.button, styles.trackButton]}
          onPress={() => navigation?.navigate('OrderDetail', { orderId: order.id })}
        >
          <Text style={styles.trackButtonText}>Track Order</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.pastOrderButtons}>
          <TouchableOpacity style={[styles.button, styles.deliveredButton]}>
            <Text style={styles.deliveredButtonText}>Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rateButton]}>
            <Text style={styles.rateButtonText}>Rate Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

// --- Main Screen Component ---
const OrderHistoryScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Current Orders</Text>
        {currentOrdersData.length > 0 ? (
          currentOrdersData.map((order) => (
            <OrderCard key={order.id} order={order} navigation={navigation} />
          ))
        ) : (
          <Text style={styles.emptyText}>No current orders</Text>
        )}

        <Text style={styles.sectionTitle}>Past Orders</Text>
        {pastOrdersData.length > 0 ? (
          pastOrdersData.map((order) => (
            <OrderCard key={order.id} order={order} navigation={navigation} />
          ))
        ) : (
          <Text style={styles.emptyText}>No past orders</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F4' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  container: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  restaurantInfo: { flex: 1, marginLeft: 12 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  restaurantLocation: { fontSize: 14, color: '#666' },
  helpButton: { alignItems: 'center' },
  helpText: { fontSize: 12, color: '#4CAF50', marginTop: 2 },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  detailLabel: { fontSize: 12, color: '#888' },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  orderedOn: { fontSize: 12, color: '#888', marginTop: 16 },
  date: { fontSize: 14, color: '#333', marginTop: 2 },
  cardFooter: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  trackButton: {
    backgroundColor: '#E0F2F1',
  },
  trackButtonText: {
    color: '#00796B',
    fontWeight: 'bold',
  },
  pastOrderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveredButton: {
    borderWidth: 1,
    borderColor: '#BDBDBD',
    width: '48%',
  },
  deliveredButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  rateButton: {
    backgroundColor: '#E0F2F1',
    width: '48%',
  },
  rateButtonText: {
    color: '#00796B',
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    paddingVertical: 8,
    paddingLeft: 8,
  },
});

export default OrderHistoryScreen;
