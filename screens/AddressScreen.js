// screens/AddressScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const addresses = [
  { id: '1', label: 'Home', address: 'HSR Layout, Sector 7' },
  { id: '2', label: 'Work', address: 'Electronic City, Phase 1' },
  { id: '3', label: 'Other', address: 'Koramangala, 5th Block' },
];

const AddressScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address</Text>
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.iconBtn}>
                <Icon name="create-outline" size={20} color="#555" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Icon name="trash-outline" size={20} color="#c0392b" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Add New */}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addText}>+ Add New Address</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  card: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: { fontWeight: 'bold', fontSize: 16 },
  address: { color: '#555', fontSize: 14 },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    padding: 5,
  },
  addBtn: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#e1f5fe',
    alignItems: 'center',
    borderRadius: 8,
  },
  addText: {
    fontWeight: 'bold',
    color: '#0277bd',
    fontSize: 16,
  },
});

export default AddressScreen;
