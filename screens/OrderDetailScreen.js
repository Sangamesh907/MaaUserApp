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

const OrderDetailScreen = ({ route, navigation }) => {
  const orderId = route?.params?.orderId || '697500';

  return (
    <SafeAreaView style={styles.detailSafeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{orderId}</Text>
      </View>

      <ScrollView style={styles.detailContainer}>
        {/* Restaurant Info Card */}
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }}
              style={styles.avatar}
            />
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>Lakshmi - Chef</Text>
              <Text style={styles.restaurantLocation}>HSR Layout</Text>
            </View>
          </View>
          <Text style={styles.addressText}>
            Address: 581, Ground Floor, 22nd Cross Road, HSR Club Road, 3rd Sector, HSR, Bangalore.
          </Text>
          <View style={styles.statusBanner}>
            <Text style={styles.statusBannerText}>
              This Order With Lakshmi ( Chef ) was on the way
            </Text>
          </View>
        </View>

        {/* Your Order Card */}
        <View style={styles.detailCard}>
          <Text style={styles.yourOrderTitle}>Your Order</Text>
          <View style={styles.billItem}>
            <Text style={styles.billItemText}>Dosa x 1</Text>
            <Text style={styles.billItemText}>₹ 60</Text>
          </View>
          <View style={styles.billItem}>
            <Text style={styles.billItemText}>Idly x 1</Text>
            <Text style={styles.billItemText}>₹ 60</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billItem}>
            <Text style={styles.billItemText}>Subtotal</Text>
            <Text style={styles.billItemText}>₹120</Text>
          </View>
          <View style={styles.billItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.billItemText}>Promo -(NEW50)</Text>
              <TouchableOpacity>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.billItemText, { color: '#d9534f' }]}>-₹75</Text>
          </View>
          <View style={styles.billItem}>
            <Text style={styles.billItemText}>Delivery Charges</Text>
            <Text style={styles.billItemText}>₹25</Text>
          </View>
          <View style={styles.billItem}>
            <Text style={styles.billItemText}>Tax</Text>
            <Text style={styles.billItemText}>₹25</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.billItem}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹120</Text>
          </View>
        </View>

        {/* Savings Card */}
        <View style={[styles.detailCard, styles.savingsCard]}>
          <Text style={styles.savingsLabel}>Your Total Savings</Text>
          <Text style={styles.savingsValue}>₹75</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('OrderTracking', { orderId })}
        >
          <Text style={styles.footerButtonText}>Track Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  detailSafeArea: { flex: 1, backgroundColor: '#fff' },
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
  detailContainer: { backgroundColor: '#F4F4F4' },
  detailCard: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    marginBottom: 0,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  restaurantInfo: { flex: 1, marginLeft: 12 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  restaurantLocation: { fontSize: 14, color: '#666' },
  addressText: { fontSize: 14, color: '#555', marginTop: 12, lineHeight: 20 },
  statusBanner: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  statusBannerText: { color: '#1E88E5', fontWeight: '500' },
  yourOrderTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  billItemText: { fontSize: 15, color: '#444' },
  removeText: { color: '#d9534f', fontSize: 12, marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 12 },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  savingsCard: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  savingsValue: { fontSize: 15, fontWeight: 'bold', color: '#28a745' },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default OrderDetailScreen;
